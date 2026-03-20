# Paketçi Windows Service

Paketçi Kurye Sistemi için Windows Servisi - Caller ID, POS ve Yazıcı entegrasyonu.

## Özellikler

- 📞 **Caller ID Entegrasyonu**
  - Serial port (COM) üzerinden Caller ID dinleme
  - Network (TCP/IP) üzerinden Caller ID dinleme
  - Otomatik müşteri tanıma ve popup

- 💻 **POS Entegrasyonu**
  - Adisyo, Sepettakip, Şefim desteği
  - Otomatik sipariş çekme
  - Menü senkronizasyonu

- 🖨️ **Yazıcı Entegrasyonu**
  - ESC/POS termal yazıcılar
  - Bluetooth yazıcılar
  - Network (Ethernet/WiFi) yazıcılar
  - USB yazıcılar
  - Fiş ve Adisyon yazdırma

## Kurulum

### 1. Gereksinimler

- Windows 10/11 veya Windows Server 2019/2022
- .NET 8.0 Runtime
- Administrator yetkileri

### 2. Kurulum Adımları

```powershell
# 1. Projeyi yayınla
dotnet publish -c Release -r win-x64 --self-contained true

# 2. Hedef bilgisayara kopyala
# PaketciWindowsService klasörünü C:\Program Files\Paketci\ altına kopyalayın

# 3. Ayarları yapılandır
notepad "C:\Program Files\Paketci\appsettings.json"

# 4. Servisi kur (Administrator olarak)
cd "C:\Program Files\Paketci"
.\install.bat
```

### 3. Manuel Kurulum

```powershell
# Administrator PowerShell
$serviceName = "PaketciWindowsService"
$binPath = "C:\Program Files\Paketci\PaketciWindowsService.exe"

# Servis oluştur
New-Service -Name $serviceName -BinaryPathName $binPath -DisplayName "Paketci Windows Service" -StartupType Automatic

# Açıklama ekle
sc.exe description $serviceName "Paketci Kurye Sistemi Windows Servisi"

# Servisi başlat
Start-Service -Name $serviceName
```

## Yapılandırma

### appsettings.json

```json
{
  "Paketci": {
    "WebSocketUrl": "wss://api.paketci.app/ws",
    "ApiKey": "RESTORAN_API_KEY",
    "RestaurantId": "RESTORAN_ID"
  },
  "CallerID": {
    "Type": "SERIAL",
    "Serial": {
      "PortName": "COM3",
      "BaudRate": "9600"
    }
  },
  "Printers": [
    {
      "Id": "kitchen",
      "Name": "Mutfak Yazıcı",
      "Type": "THERMAL",
      "ConnectionType": "ETHERNET",
      "ConnectionString": "192.168.1.50:9100",
      "PaperWidth": "80",
      "IsDefault": true
    }
  ]
}
```

### Caller ID Ayarları

**Serial Port (COM):**
```json
"CallerID": {
  "Type": "SERIAL",
  "Serial": {
    "PortName": "COM3",
    "BaudRate": "9600"
  }
}
```

**Network (TCP/IP):**
```json
"CallerID": {
  "Type": "NETWORK",
  "Network": {
    "Ip": "192.168.1.100",
    "Port": "5000"
  }
}
```

### Yazıcı Ayarları

**Ethernet/WiFi Yazıcı:**
```json
{
  "ConnectionType": "ETHERNET",
  "ConnectionString": "192.168.1.50:9100"
}
```

**USB Yazıcı:**
```json
{
  "ConnectionType": "USB",
  "ConnectionString": "USB001"
}
```

**Bluetooth Yazıcı:**
```json
{
  "ConnectionType": "BLUETOOTH",
  "ConnectionString": "AA:BB:CC:DD:EE:FF"
}
```

## Yönetim

### Servis Durumu

```powershell
# Durum kontrolü
sc query PaketciWindowsService

# Başlat
sc start PaketciWindowsService

# Durdur
sc stop PaketciWindowsService

# Yeniden başlat
sc stop PaketciWindowsService
sc start PaketciWindowsService

# Kaldır
sc delete PaketciWindowsService
```

### Loglar

Log dosyaları `logs/` klasöründe günlük olarak oluşturulur:

```
logs/
  paketci-20240319.log
  paketci-20240320.log
```

## Sorun Giderme

### Servis Başlamıyor

1. Event Viewer'dan hata mesajlarını kontrol edin
2. `logs/` klasöründe logları inceleyin
3. `appsettings.json` dosyasının doğru formatta olduğundan emin olun

### Caller ID Çalışmıyor

1. Seri port doğru mu? `Device Manager` → `Ports (COM & LPT)` kontrolü
2. Baud rate Caller ID cihazıyla eşleşiyor mu?
3. Başka bir uygulama portu kullanıyor mu?

### Yazıcı Çalışmıyor

1. Yazıcı IP adresine ping atın
2. Port 9100 açık mı? `telnet 192.168.1.50 9100`
3. Kağıt ve termal rulo kontrolü

## Geliştirme

```bash
# Projeyi derle
dotnet build

# Çalıştır
dotnet run

# Yayınla
dotnet publish -c Release -r win-x64 --self-contained true
```

## Lisans

MIT License
