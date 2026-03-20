using System.IO.Ports;
using System.Net.Sockets;
using System.Text;
using System.Text.RegularExpressions;

namespace PaketciWindowsService.Services;

public class CallerIDService
{
    private readonly ILogger<CallerIDService> _logger;
    private readonly IConfiguration _configuration;
    private SerialPort? _serialPort;
    private TcpClient? _tcpClient;
    private CancellationTokenSource? _cancellationTokenSource;

    public event EventHandler<CallerIDEventArgs>? OnIncomingCall;

    public CallerIDService(ILogger<CallerIDService> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        var deviceType = _configuration["CallerID:Type"]; // SERIAL, NETWORK, SOFTWARE
        
        _cancellationTokenSource = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);

        switch (deviceType?.ToUpper())
        {
            case "SERIAL":
                await StartSerialListenerAsync(_cancellationTokenSource.Token);
                break;
                
            case "NETWORK":
                await StartNetworkListenerAsync(_cancellationTokenSource.Token);
                break;
                
            case "SOFTWARE":
                _logger.LogInformation("Software Caller ID mode - waiting for API calls");
                break;
                
            default:
                _logger.LogWarning("No Caller ID device configured");
                break;
        }
    }

    public Task StopAsync()
    {
        _cancellationTokenSource?.Cancel();
        _serialPort?.Close();
        _tcpClient?.Close();
        return Task.CompletedTask;
    }

    #region Serial Port Listener

    private async Task StartSerialListenerAsync(CancellationToken cancellationToken)
    {
        var portName = _configuration["CallerID:Serial:PortName"] ?? "COM3";
        var baudRate = int.Parse(_configuration["CallerID:Serial:BaudRate"] ?? "9600");

        _logger.LogInformation("Starting Serial Caller ID listener on {Port} @ {BaudRate}bps", portName, baudRate);

        try
        {
            _serialPort = new SerialPort(portName, baudRate)
            {
                DataBits = 8,
                Parity = Parity.None,
                StopBits = StopBits.One,
                Handshake = Handshake.None,
                ReadTimeout = 500,
                WriteTimeout = 500
            };

            _serialPort.DataReceived += (sender, e) =>
            {
                try
                {
                    var data = _serialPort.ReadExisting();
                    ProcessCallerIDData(data);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error reading from serial port");
                }
            };

            _serialPort.Open();
            _logger.LogInformation("Serial Caller ID listener started successfully");

            // CancellationToken bekleyelim
            await Task.Delay(Timeout.Infinite, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to start Serial Caller ID listener");
            throw;
        }
    }

    #endregion

    #region Network Listener

    private async Task StartNetworkListenerAsync(CancellationToken cancellationToken)
    {
        var ip = _configuration["CallerID:Network:Ip"] ?? "192.168.1.100";
        var port = int.Parse(_configuration["CallerID:Network:Port"] ?? "5000");

        _logger.LogInformation("Starting Network Caller ID listener on {Ip}:{Port}", ip, port);

        try
        {
            _tcpClient = new TcpClient();
            await _tcpClient.ConnectAsync(ip, port);

            _logger.LogInformation("Network Caller ID connected successfully");

            var stream = _tcpClient.GetStream();
            var buffer = new byte[1024];

            while (!cancellationToken.IsCancellationRequested && _tcpClient.Connected)
            {
                try
                {
                    var bytesRead = await stream.ReadAsync(buffer.AsMemory(0, buffer.Length), cancellationToken);
                    
                    if (bytesRead == 0)
                    {
                        _logger.LogWarning("Network Caller ID disconnected");
                        break;
                    }

                    var data = Encoding.UTF8.GetString(buffer, 0, bytesRead);
                    ProcessNetworkCallerIDData(data);
                }
                catch (OperationCanceledException)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error reading from network Caller ID");
                    await Task.Delay(1000, cancellationToken);
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to start Network Caller ID listener");
            throw;
        }
    }

    #endregion

    #region Data Processing

    private void ProcessCallerIDData(string data)
    {
        _logger.LogDebug("Raw Caller ID data: {Data}", data);

        // Farklı Caller ID formatlarını parse et
        var callerInfo = ParseCallerIDFormat(data);
        
        if (callerInfo != null)
        {
            _logger.LogInformation("Incoming call from: {Number}", callerInfo.PhoneNumber);
            
            OnIncomingCall?.Invoke(this, new CallerIDEventArgs
            {
                PhoneNumber = callerInfo.PhoneNumber,
                CallerName = callerInfo.Name,
                Timestamp = DateTime.Now
            });
        }
    }

    private void ProcessNetworkCallerIDData(string data)
    {
        _logger.LogDebug("Raw Network Caller ID data: {Data}", data);

        // Network format: "PHONE|NAME|LINE" veya JSON
        var parts = data.Split('|');
        
        if (parts.Length >= 1)
        {
            var phoneNumber = parts[0].Trim();
            var callerName = parts.Length > 1 ? parts[1].Trim() : null;
            var lineNumber = parts.Length > 2 ? parts[2].Trim() : null;

            _logger.LogInformation("Incoming call from: {Number} (Line: {Line})", phoneNumber, lineNumber);

            OnIncomingCall?.Invoke(this, new CallerIDEventArgs
            {
                PhoneNumber = phoneNumber,
                CallerName = callerName,
                LineNumber = lineNumber,
                Timestamp = DateTime.Now
            });
        }
    }

    private CallerInfo? ParseCallerIDFormat(string data)
    {
        // Format 1: "N:05321234567"
        var match1 = Regex.Match(data, @"N:(\d+)");
        if (match1.Success)
        {
            return new CallerInfo
            {
                PhoneNumber = match1.Groups[1].Value,
                Name = ExtractName(data)
            };
        }

        // Format 2: "NUMBER=05321234567"
        var match2 = Regex.Match(data, @"NUMBER[=:](\d+)");
        if (match2.Success)
        {
            return new CallerInfo
            {
                PhoneNumber = match2.Groups[1].Value,
                Name = ExtractName(data)
            };
        }

        // Format 3: Sadece numara (10-11 haneli)
        var match3 = Regex.Match(data, @"\b(\d{10,11})\b");
        if (match3.Success)
        {
            return new CallerInfo
            {
                PhoneNumber = match3.Groups[1].Value
            };
        }

        return null;
    }

    private string? ExtractName(string data)
    {
        var nameMatch = Regex.Match(data, @"NAME[=:](.+?)[\r\n]");
        if (nameMatch.Success)
        {
            return nameMatch.Groups[1].Value.Trim();
        }
        return null;
    }

    #endregion

    private class CallerInfo
    {
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Name { get; set; }
    }
}
