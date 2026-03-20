namespace PaketciWindowsService.Services;

public class POSService
{
    private readonly ILogger<POSService> _logger;
    private readonly WebSocketClientService _webSocketClient;
    private readonly HttpClient _httpClient;

    public POSService(
        ILogger<POSService> logger,
        WebSocketClientService webSocketClient)
    {
        _logger = logger;
        _webSocketClient = webSocketClient;
        _httpClient = new HttpClient();
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("POS Service started");
        return Task.CompletedTask;
    }

    public Task StopAsync()
    {
        _logger.LogInformation("POS Service stopped");
        _httpClient.Dispose();
        return Task.CompletedTask;
    }

    public async Task PullOrdersAsync(string posType)
    {
        _logger.LogInformation("Pulling orders from {PosType}", posType);
        
        // Backend'e bildir
        await _webSocketClient.SendAsync(new WebSocketMessage
        {
            Type = "pos_orders_pulled",
            Data = new
            {
                posType,
                timestamp = DateTimeOffset.Now.ToUnixTimeSeconds(),
                count = 0 // TODO: Implement actual order pulling
            }
        });
    }

    public async Task SyncMenuAsync(string posType)
    {
        _logger.LogInformation("Syncing menu with {PosType}", posType);
        
        await _webSocketClient.SendAsync(new WebSocketMessage
        {
            Type = "pos_menu_synced",
            Data = new
            {
                posType,
                timestamp = DateTimeOffset.Now.ToUnixTimeSeconds()
            }
        });
    }

    public async Task PushPaymentAsync(string orderId, PaymentData payment)
    {
        _logger.LogInformation("Pushing payment for order {OrderId}", orderId);
        
        await _webSocketClient.SendAsync(new WebSocketMessage
        {
            Type = "pos_payment_pushed",
            Data = new
            {
                orderId,
                payment,
                timestamp = DateTimeOffset.Now.ToUnixTimeSeconds()
            }
        });
    }
}

// Data Models
public class ReceiptData
{
    public string RestaurantName { get; set; } = string.Empty;
    public string ReceiptNumber { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public List<ReceiptItem> Items { get; set; } = new();
    public decimal Total { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string? CustomerName { get; set; }
    public string? CustomerPhone { get; set; }
    public string? Address { get; set; }
    public string? Note { get; set; }
}

public class ReceiptItem
{
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Total { get; set; }
}

public class AdisyonData
{
    public string OrderId { get; set; } = string.Empty;
    public string? TableNumber { get; set; }
    public List<AdisyonItem> Items { get; set; } = new();
    public string OrderType { get; set; } = string.Empty;
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AdisyonItem
{
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public List<string>? Options { get; set; }
    public string? Note { get; set; }
}

public class PaymentData
{
    public string Method { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal? Tip { get; set; }
    public DateTime Timestamp { get; set; }
}
