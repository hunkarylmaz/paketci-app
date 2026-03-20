using System.Drawing;
using System.Drawing.Printing;
using System.Runtime.InteropServices;
using System.Text;

namespace PaketciWindowsService.Services;

public class PrinterService
{
    private readonly ILogger<PrinterService> _logger;
    private readonly IConfiguration _configuration;
    private readonly List<PrinterConfig> _printers = new();

    public PrinterService(ILogger<PrinterService> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
        LoadPrinters();
    }

    private void LoadPrinters()
    {
        var printerConfigs = _configuration.GetSection("Printers").GetChildren();
        foreach (var config in printerConfigs)
        {
            _printers.Add(new PrinterConfig
            {
                Id = config["Id"] ?? Guid.NewGuid().ToString(),
                Name = config["Name"] ?? "Default",
                Type = Enum.Parse<PrinterType>(config["Type"] ?? "THERMAL"),
                ConnectionType = Enum.Parse<ConnectionType>(config["ConnectionType"] ?? "USB"),
                ConnectionString = config["ConnectionString"] ?? "",
                PaperWidth = int.Parse(config["PaperWidth"] ?? "80"),
                IsDefault = bool.Parse(config["IsDefault"] ?? "false")
            });
        }

        _logger.LogInformation("Loaded {Count} printers", _printers.Count);
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Printer service started");
        return Task.CompletedTask;
    }

    public Task StopAsync()
    {
        _logger.LogInformation("Printer service stopped");
        return Task.CompletedTask;
    }

    public void PrintReceipt(ReceiptData receipt, string? printerId = null)
    {
        var printer = GetPrinter(printerId);
        if (printer == null)
        {
            _logger.LogError("No printer found");
            throw new InvalidOperationException("No printer configured");
        }

        _logger.LogInformation("Printing receipt #{ReceiptNumber} on {Printer}", receipt.ReceiptNumber, printer.Name);

        switch (printer.ConnectionType)
        {
            case ConnectionType.USB:
            case ConnectionType.ETHERNET:
            case ConnectionType.WIFI:
                PrintESCPOSReceipt(receipt, printer);
                break;
                
            case ConnectionType.BLUETOOTH:
                PrintBluetoothReceipt(receipt, printer);
                break;
                
            case ConnectionType.WINDOWS:
                PrintWindowsReceipt(receipt, printer);
                break;
        }
    }

    public void PrintAdisyon(AdisyonData adisyon, string? printerId = null)
    {
        var printer = GetPrinter(printerId);
        if (printer == null)
        {
            _logger.LogError("No printer found");
            throw new InvalidOperationException("No printer configured");
        }

        _logger.LogInformation("Printing adisyon #{OrderId} on {Printer}", adisyon.OrderId, printer.Name);

        switch (printer.ConnectionType)
        {
            case ConnectionType.USB:
            case ConnectionType.ETHERNET:
            case ConnectionType.WIFI:
                PrintESCPOSAdisyon(adisyon, printer);
                break;
                
            case ConnectionType.BLUETOOTH:
                PrintBluetoothAdisyon(adisyon, printer);
                break;
        }
    }

    private void PrintESCPOSReceipt(ReceiptData receipt, PrinterConfig printer)
    {
        var commands = new List<byte>();

        // Initialize printer
        commands.AddRange(new byte[] { 0x1B, 0x40 });

        // Center alignment
        commands.AddRange(new byte[] { 0x1B, 0x61, 0x01 });

        // Bold on - Restaurant name
        commands.AddRange(new byte[] { 0x1B, 0x45, 0x01 });
        commands.AddRange(Encoding.UTF8.GetBytes(receipt.RestaurantName + "\n"));
        commands.AddRange(new byte[] { 0x1B, 0x45, 0x00 });

        // Receipt number
        commands.AddRange(Encoding.UTF8.GetBytes($"Fiş No: {receipt.ReceiptNumber}\n"));
        commands.AddRange(Encoding.UTF8.GetBytes($"Tarih: {receipt.Date:dd.MM.yyyy HH:mm}\n"));
        commands.AddRange(Encoding.UTF8.GetBytes("--------------------------------\n"));

        // Left alignment
        commands.AddRange(new byte[] { 0x1B, 0x61, 0x00 });

        // Items
        foreach (var item in receipt.Items)
        {
            var line = FormatReceiptLine(item.Name, item.Quantity, item.UnitPrice, item.Total, printer.PaperWidth);
            commands.AddRange(Encoding.UTF8.GetBytes(line + "\n"));
        }

        commands.AddRange(Encoding.UTF8.GetBytes("--------------------------------\n"));

        // Total - Bold
        commands.AddRange(new byte[] { 0x1B, 0x45, 0x01 });
        commands.AddRange(Encoding.UTF8.GetBytes(FormatTotalLine("TOPLAM:", receipt.Total, printer.PaperWidth) + "\n"));
        commands.AddRange(new byte[] { 0x1B, 0x45, 0x00 });

        // Payment method
        commands.AddRange(Encoding.UTF8.GetBytes($"Ödeme: {receipt.PaymentMethod}\n"));

        // Customer info
        if (!string.IsNullOrEmpty(receipt.CustomerName))
        {
            commands.AddRange(Encoding.UTF8.GetBytes($"Müşteri: {receipt.CustomerName}\n"));
        }
        if (!string.IsNullOrEmpty(receipt.CustomerPhone))
        {
            commands.AddRange(Encoding.UTF8.GetBytes($"Tel: {receipt.CustomerPhone}\n"));
        }

        // Footer
        commands.AddRange(Encoding.UTF8.GetBytes("\n"));
        commands.AddRange(Encoding.UTF8.GetBytes("Teşekkür ederiz!\n"));
        commands.AddRange(Encoding.UTF8.GetBytes("\n\n"));

        // Cut paper
        commands.AddRange(new byte[] { 0x1D, 0x56, 0x00 });

        // Send to printer
        SendToPrinter(commands.ToArray(), printer);
    }

    private void PrintESCPOSAdisyon(AdisyonData adisyon, PrinterConfig printer)
    {
        var commands = new List<byte>();

        // Initialize
        commands.AddRange(new byte[] { 0x1B, 0x40 });

        // Double height and width for ADISYON
        commands.AddRange(new byte[] { 0x1D, 0x21, 0x11 });
        commands.AddRange(Encoding.UTF8.GetBytes("*** ADISYON ***\n"));
        commands.AddRange(new byte[] { 0x1D, 0x21, 0x00 });

        // Order info
        commands.AddRange(Encoding.UTF8.GetBytes($"Sipariş: {adisyon.OrderId}\n"));
        if (!string.IsNullOrEmpty(adisyon.TableNumber))
        {
            commands.AddRange(Encoding.UTF8.GetBytes($"Masa: {adisyon.TableNumber}\n"));
        }
        commands.AddRange(Encoding.UTF8.GetBytes($"Tür: {adisyon.OrderType}\n"));
        commands.AddRange(Encoding.UTF8.GetBytes($"Saat: {adisyon.CreatedAt:HH:mm}\n"));
        commands.AddRange(Encoding.UTF8.GetBytes("--------------------------------\n"));

        // Items with bold for product names
        foreach (var item in adisyon.Items)
        {
            commands.AddRange(new byte[] { 0x1B, 0x45, 0x01 });
            commands.AddRange(Encoding.UTF8.GetBytes($"{item.Quantity}x {item.Name}\n"));
            commands.AddRange(new byte[] { 0x1B, 0x45, 0x00 });
            
            if (item.Options?.Any() == true)
            {
                commands.AddRange(Encoding.UTF8.GetBytes($"   ({string.Join(", ", item.Options)})\n"));
            }
            if (!string.IsNullOrEmpty(item.Note))
            {
                commands.AddRange(Encoding.UTF8.GetBytes($"   Not: {item.Note}\n"));
            }
        }

        if (!string.IsNullOrEmpty(adisyon.Note))
        {
            commands.AddRange(Encoding.UTF8.GetBytes("--------------------------------\n"));
            commands.AddRange(Encoding.UTF8.GetBytes($"NOT: {adisyon.Note}\n"));
        }

        commands.AddRange(Encoding.UTF8.GetBytes("\n\n"));
        commands.AddRange(new byte[] { 0x1D, 0x56, 0x00 });

        SendToPrinter(commands.ToArray(), printer);
    }

    private void PrintBluetoothReceipt(ReceiptData receipt, PrinterConfig printer)
    {
        // Bluetooth yazıcılar için basit format
        var sb = new StringBuilder();
        
        sb.AppendLine("================================");
        sb.AppendLine($"    {receipt.RestaurantName}");
        sb.AppendLine($"    {receipt.ReceiptNumber}");
        sb.AppendLine("================================");
        sb.AppendLine();
        
        foreach (var item in receipt.Items)
        {
            sb.AppendLine(item.Name);
            sb.AppendLine($"{item.Quantity}x {item.UnitPrice:C2} = {item.Total:C2}");
        }
        
        sb.AppendLine();
        sb.AppendLine("================================");
        sb.AppendLine($"TOPLAM: {receipt.Total:C2}");
        sb.AppendLine("================================");
        sb.AppendLine();
        sb.AppendLine("Teşekkür ederiz!");
        sb.AppendLine();

        // Android servisine gönderilecek komut
        // Implementation depends on Bluetooth library used
        _logger.LogInformation("Bluetooth receipt queued for {Printer}", printer.Name);
    }

    private void PrintBluetoothAdisyon(AdisyonData adisyon, PrinterConfig printer)
    {
        var sb = new StringBuilder();
        
        sb.AppendLine("*** ADISYON ***");
        sb.AppendLine($"Sipariş: {adisyon.OrderId}");
        if (!string.IsNullOrEmpty(adisyon.TableNumber))
        {
            sb.AppendLine($"Masa: {adisyon.TableNumber}");
        }
        sb.AppendLine();
        
        foreach (var item in adisyon.Items)
        {
            sb.AppendLine($"{item.Quantity}x {item.Name}");
            if (item.Options?.Any() == true)
            {
                sb.AppendLine($"   {string.Join(", ", item.Options)}");
            }
        }
        
        sb.AppendLine();
        sb.AppendLine("****************");

        _logger.LogInformation("Bluetooth adisyon queued for {Printer}", printer.Name);
    }

    private void PrintWindowsReceipt(ReceiptData receipt, PrinterConfig printer)
    {
        // Windows Print Spooler kullanarak yazdır
        using var pd = new PrintDocument();
        pd.PrinterSettings.PrinterName = printer.ConnectionString;
        
        pd.PrintPage += (sender, e) =>
        {
            var graphics = e.Graphics;
            var font = new Font("Consolas", 10);
            var boldFont = new Font("Consolas", 12, FontStyle.Bold);
            float y = 10;
            
            // Restaurant name
            graphics.DrawString(receipt.RestaurantName, boldFont, Brushes.Black, 10, y);
            y += 25;
            
            // Receipt info
            graphics.DrawString($"Fiş No: {receipt.ReceiptNumber}", font, Brushes.Black, 10, y);
            y += 20;
            graphics.DrawString($"Tarih: {receipt.Date:dd.MM.yyyy HH:mm}", font, Brushes.Black, 10, y);
            y += 30;
            
            // Line
            graphics.DrawString(new string('-', 40), font, Brushes.Black, 10, y);
            y += 20;
            
            // Items
            foreach (var item in receipt.Items)
            {
                graphics.DrawString($"{item.Name}", font, Brushes.Black, 10, y);
                y += 18;
                graphics.DrawString($"  {item.Quantity}x {item.UnitPrice:C2} = {item.Total:C2}", font, Brushes.Black, 10, y);
                y += 18;
            }
            
            // Total
            y += 10;
            graphics.DrawString(new string('-', 40), font, Brushes.Black, 10, y);
            y += 20;
            graphics.DrawString($"TOPLAM: {receipt.Total:C2}", boldFont, Brushes.Black, 10, y);
        };
        
        pd.Print();
    }

    private void SendToPrinter(byte[] data, PrinterConfig printer)
    {
        if (printer.ConnectionType == ConnectionType.ETHERNET || printer.ConnectionType == ConnectionType.WIFI)
        {
            // TCP/IP üzerinden gönder
            var parts = printer.ConnectionString.Split(':');
            var ip = parts[0];
            var port = int.Parse(parts[1]);
            
            using var client = new System.Net.Sockets.TcpClient();
            client.Connect(ip, port);
            using var stream = client.GetStream();
            stream.Write(data, 0, data.Length);
        }
        else if (printer.ConnectionType == ConnectionType.USB)
        {
            // USB yazıcı - Windows API veya libusb kullan
            // Implementation depends on specific printer
            _logger.LogInformation("USB printer output: {Length} bytes", data.Length);
        }
    }

    private PrinterConfig? GetPrinter(string? printerId)
    {
        if (!string.IsNullOrEmpty(printerId))
        {
            return _printers.FirstOrDefault(p => p.Id == printerId);
        }
        return _printers.FirstOrDefault(p => p.IsDefault) ?? _printers.FirstOrDefault();
    }

    private string FormatReceiptLine(string name, int quantity, decimal unitPrice, decimal total, int paperWidth)
    {
        var line = $"{name}";
        var pricePart = $"{quantity}x{unitPrice:C0}={total:C0}";
        
        var charsPerLine = paperWidth == 80 ? 48 : 32;
        var spaceCount = charsPerLine - line.Length - pricePart.Length;
        
        if (spaceCount < 1) spaceCount = 1;
        
        return line + new string(' ', spaceCount) + pricePart;
    }

    private string FormatTotalLine(string label, decimal total, int paperWidth)
    {
        var charsPerLine = paperWidth == 80 ? 48 : 32;
        var spaceCount = charsPerLine - label.Length - total.ToString("C").Length;
        return label + new string(' ', spaceCount) + total.ToString("C");
    }
}

public class PrinterConfig
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public PrinterType Type { get; set; }
    public ConnectionType ConnectionType { get; set; }
    public string ConnectionString { get; set; } = string.Empty;
    public int PaperWidth { get; set; } = 80;
    public bool IsDefault { get; set; }
}

public enum PrinterType
{
    THERMAL,
    LABEL,
    IMPACT,
    MOBILE
}

public enum ConnectionType
{
    USB,
    BLUETOOTH,
    WIFI,
    ETHERNET,
    SERIAL,
    WINDOWS
}
