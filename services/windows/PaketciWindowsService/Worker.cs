using PaketciWindowsService.Services;

namespace PaketciWindowsService;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly WebSocketClientService _webSocketClient;
    private readonly CallerIDService _callerIdService;
    private readonly PrinterService _printerService;
    private readonly POSService _posService;

    public Worker(
        ILogger<Worker> logger,
        WebSocketClientService webSocketClient,
        CallerIDService callerIdService,
        PrinterService printerService,
        POSService posService)
    {
        _logger = logger;
        _webSocketClient = webSocketClient;
        _callerIdService = callerIdService;
        _printerService = printerService;
        _posService = posService;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Paketci Windows Service started at: {time}", DateTimeOffset.Now);

        try
        {
            // WebSocket bağlantısını başlat
            _webSocketClient.OnMessageReceived += OnWebSocketMessage;
            await _webSocketClient.ConnectAsync(stoppingToken);

            // Caller ID dinleyiciyi başlat
            _callerIdService.OnIncomingCall += OnIncomingCall;
            await _callerIdService.StartAsync(stoppingToken);

            // Yazıcı servisini başlat
            await _printerService.StartAsync(stoppingToken);

            // POS servisini başlat
            await _posService.StartAsync(stoppingToken);

            _logger.LogInformation("All services initialized successfully");

            // Servis çalışırken bekle
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(1000, stoppingToken);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in worker service");
            throw;
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Paketci Windows Service stopping...");

        _callerIdService.OnIncomingCall -= OnIncomingCall;
        _webSocketClient.OnMessageReceived -= OnWebSocketMessage;

        await _webSocketClient.DisconnectAsync();
        await _callerIdService.StopAsync();
        await _printerService.StopAsync();
        await _posService.StopAsync();

        await base.StopAsync(cancellationToken);
    }

    // Backend'den gelen mesajları işle
    private void OnWebSocketMessage(object? sender, WebSocketMessage message)
    {
        _logger.LogInformation("Received message from backend: {Type}", message.Type);

        switch (message.Type)
        {
            case "print_receipt":
                HandlePrintReceipt(message.Data);
                break;

            case "print_adisyon":
                HandlePrintAdisyon(message.Data);
                break;

            case "caller_id_popup":
                HandleCallerIDPopup(message.Data);
                break;

            case "pos_command":
                HandlePOSCommand(message.Data);
                break;

            default:
                _logger.LogWarning("Unknown message type: {Type}", message.Type);
                break;
        }
    }

    // Gelen aramayı backend'e bildir
    private void OnIncomingCall(object? sender, CallerIDEventArgs e)
    {
        _logger.LogInformation("Incoming call detected: {Number}", e.PhoneNumber);

        _webSocketClient.SendAsync(new WebSocketMessage
        {
            Type = "incoming_call",
            Data = new
            {
                phoneNumber = e.PhoneNumber,
                callerName = e.CallerName,
                lineNumber = e.LineNumber,
                timestamp = DateTimeOffset.Now.ToUnixTimeSeconds()
            }
        });
    }

    // Fiş yazdırma
    private void HandlePrintReceipt(dynamic data)
    {
        try
        {
            var receipt = new ReceiptData
            {
                RestaurantName = data.restaurantName,
                ReceiptNumber = data.receiptNumber,
                Date = DateTime.Parse(data.date),
                Items = ((IEnumerable<dynamic>)data.items).Select(i => new ReceiptItem
                {
                    Name = i.name,
                    Quantity = i.quantity,
                    UnitPrice = decimal.Parse(i.unitPrice.ToString()),
                    Total = decimal.Parse(i.total.ToString())
                }).ToList(),
                Total = decimal.Parse(data.total.ToString()),
                PaymentMethod = data.paymentMethod,
                CustomerName = data.customerName,
                CustomerPhone = data.customerPhone,
                Address = data.address,
                Note = data.note
            };

            _printerService.PrintReceipt(receipt, data.printerId?.ToString());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error printing receipt");
        }
    }

    // Adisyon yazdırma
    private void HandlePrintAdisyon(dynamic data)
    {
        try
        {
            var adisyon = new AdisyonData
            {
                OrderId = data.orderId,
                TableNumber = data.tableNumber,
                Items = ((IEnumerable<dynamic>)data.items).Select(i => new AdisyonItem
                {
                    Name = i.name,
                    Quantity = i.quantity,
                    Options = i.options?.ToObject<List<string>>() ?? new List<string>(),
                    Note = i.note
                }).ToList(),
                OrderType = data.orderType,
                Note = data.note,
                CreatedAt = DateTime.Parse(data.createdAt)
            };

            _printerService.PrintAdisyon(adisyon, data.printerId?.ToString());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error printing adisyon");
        }
    }

    // Caller ID popup göster
    private void HandleCallerIDPopup(dynamic data)
    {
        // Windows Forms veya WPF ile popup göster
        _logger.LogInformation("Showing caller ID popup for: {Phone}", data.phoneNumber);
        
        // TODO: Implement Windows Forms popup
    }

    // POS komutunu işle
    private void HandlePOSCommand(dynamic data)
    {
        string command = data.command;
        
        switch (command)
        {
            case "pull_orders":
                _posService.PullOrdersAsync(data.posType.ToString());
                break;
                
            case "sync_menu":
                _posService.SyncMenuAsync(data.posType.ToString());
                break;
                
            default:
                _logger.LogWarning("Unknown POS command: {Command}", command);
                break;
        }
    }
}

// Event Args
public class CallerIDEventArgs : EventArgs
{
    public string PhoneNumber { get; set; } = string.Empty;
    public string? CallerName { get; set; }
    public string? LineNumber { get; set; }
    public DateTime Timestamp { get; set; }
}

// WebSocket Mesaj
public class WebSocketMessage
{
    public string Type { get; set; } = string.Empty;
    public object? Data { get; set; }
}
