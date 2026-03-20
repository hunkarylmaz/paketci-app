using PaketciWindowsService.Services;
using Serilog;

var builder = Host.CreateApplicationBuilder(args);

// Windows Service olarak çalış
builder.Services.AddWindowsService(options =>
{
    options.ServiceName = "Paketci Windows Service";
});

// Logging
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .WriteTo.Console()
    .WriteTo.File("logs/paketci-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Logging.ClearProviders();
builder.Logging.AddSerilog();

// Konfigürasyon
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

// Servisleri kaydet
builder.Services.AddSingleton<WebSocketClientService>();
builder.Services.AddSingleton<CallerIDService>();
builder.Services.AddSingleton<PrinterService>();
builder.Services.AddSingleton< POSService>();
builder.Services.AddHostedService<Worker>();

var host = builder.Build();
host.Run();
