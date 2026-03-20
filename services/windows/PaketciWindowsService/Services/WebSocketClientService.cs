using Newtonsoft.Json;
using System.Net.WebSockets;
using System.Text;

namespace PaketciWindowsService.Services;

public class WebSocketClientService
{
    private readonly ILogger<WebSocketClientService> _logger;
    private readonly IConfiguration _configuration;
    private ClientWebSocket? _webSocket;
    private CancellationTokenSource? _cancellationTokenSource;
    private readonly string _serverUrl;
    private readonly string _apiKey;
    private readonly string _restaurantId;

    public event EventHandler<WebSocketMessage>? OnMessageReceived;
    public event EventHandler? OnConnected;
    public event EventHandler? OnDisconnected;

    public bool IsConnected => _webSocket?.State == WebSocketState.Open;

    public WebSocketClientService(ILogger<WebSocketClientService> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
        _serverUrl = configuration["Paketci:WebSocketUrl"] ?? "wss://api.paketci.app/ws";
        _apiKey = configuration["Paketci:ApiKey"] ?? "";
        _restaurantId = configuration["Paketci:RestaurantId"] ?? "";
    }

    public async Task ConnectAsync(CancellationToken cancellationToken)
    {
        _cancellationTokenSource = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        
        while (!_cancellationTokenSource.Token.IsCancellationRequested)
        {
            try
            {
                await ConnectInternalAsync(_cancellationTokenSource.Token);
                await ReceiveLoopAsync(_cancellationTokenSource.Token);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "WebSocket error, reconnecting in 5 seconds...");
                OnDisconnected?.Invoke(this, EventArgs.Empty);
                await Task.Delay(5000, _cancellationTokenSource.Token);
            }
        }
    }

    private async Task ConnectInternalAsync(CancellationToken cancellationToken)
    {
        _webSocket = new ClientWebSocket();
        
        // Headers ekle
        _webSocket.Options.SetRequestHeader("X-API-Key", _apiKey);
        _webSocket.Options.SetRequestHeader("X-Restaurant-Id", _restaurantId);

        _logger.LogInformation("Connecting to WebSocket server: {Url}", _serverUrl);
        
        await _webSocket.ConnectAsync(new Uri(_serverUrl), cancellationToken);
        
        _logger.LogInformation("WebSocket connected successfully");
        OnConnected?.Invoke(this, EventArgs.Empty);

        // Bağlantı bilgilerini gönder
        await SendAsync(new WebSocketMessage
        {
            Type = "service_connected",
            Data = new
            {
                restaurantId = _restaurantId,
                serviceType = "windows",
                timestamp = DateTimeOffset.Now.ToUnixTimeSeconds()
            }
        });
    }

    private async Task ReceiveLoopAsync(CancellationToken cancellationToken)
    {
        var buffer = new byte[4096];

        while (_webSocket?.State == WebSocketState.Open && !cancellationToken.IsCancellationRequested)
        {
            try
            {
                var result = await _webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), cancellationToken);

                if (result.MessageType == WebSocketMessageType.Close)
                {
                    _logger.LogInformation("WebSocket closed by server");
                    await _webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", cancellationToken);
                    break;
                }

                var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                _logger.LogDebug("Received: {Message}", message);

                try
                {
                    var wsMessage = JsonConvert.DeserializeObject<WebSocketMessage>(message);
                    if (wsMessage != null)
                    {
                        OnMessageReceived?.Invoke(this, wsMessage);
                    }
                }
                catch (JsonException ex)
                {
                    _logger.LogWarning(ex, "Failed to parse WebSocket message");
                }
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in receive loop");
                throw;
            }
        }
    }

    public async Task SendAsync(WebSocketMessage message)
    {
        if (_webSocket?.State != WebSocketState.Open)
        {
            _logger.LogWarning("Cannot send message, WebSocket is not connected");
            return;
        }

        var json = JsonConvert.SerializeObject(message);
        var bytes = Encoding.UTF8.GetBytes(json);

        await _webSocket.SendAsync(
            new ArraySegment<byte>(bytes),
            WebSocketMessageType.Text,
            endOfMessage: true,
            CancellationToken.None);
    }

    public async Task DisconnectAsync()
    {
        _cancellationTokenSource?.Cancel();

        if (_webSocket?.State == WebSocketState.Open)
        {
            await _webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Service stopping", CancellationToken.None);
        }

        _webSocket?.Dispose();
        _logger.LogInformation("WebSocket disconnected");
    }
}
