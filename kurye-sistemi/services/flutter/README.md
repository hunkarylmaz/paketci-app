# 🚀 Paketçi Kurye - Flutter App

Hem Android hem iOS için kurye mobil uygulaması.

## 📱 Özellikler

- ✅ **Konum Takibi** - Gerçek zamanlı GPS konum gönderimi (5 saniye aralıkla)
- ✅ **Push Bildirimler** - Firebase Cloud Messaging (FCM)
- ✅ **Sipariş Yönetimi** - Yeni siparişler, durum güncelleme
- ✅ **Harita Entegrasyonu** - OpenStreetMap ile navigasyon
- ✅ **Acil Durum Butonu** - Tek dokunuşla yardım çağrısı
- ✅ **Mola Talebi** - Bayiden mola izni isteme
- ✅ **Caller ID** - Gelen aramada müşteri bilgisi gösterme (Android)

## ❌ Yazdırma Yok

**Kurye uygulamasında yazdırma özelliği BULUNMAZ.** 

Yazdırma/restaurant işlemleri şu şekilde yönetilir:
- **Restoran Paneli** (`isletme.paketciniz.com`) - Web üzerinden yazdırma
- **Windows Servisi** - Restoran bilgisayarında POS/Caller ID/Yazıcı entegrasyonu

Kurye sadece şunları yapar:
1. Sipariş alır
2. Navigasyon yapar  
3. Teslimat yapar
4. Durum günceller

## 🛠️ Kurulum

### 1. Flutter Kurulumu
```bash
# Flutter SDK kurulu olmalı
flutter doctor
```

### 2. Bağımlılıkları Yükle
```bash
cd services/flutter
flutter pub get
```

### 3. Firebase Yapılandırması

#### Android:
1. Firebase Console'dan `google-services.json` indir
2. `android/app/` içine kopyala

#### iOS:
1. Firebase Console'dan `GoogleService-Info.plist` indir
2. `ios/Runner/` içine kopyala
3. Xcode ile aç ve "Runner" target'ına ekle

### 4. Derle
```bash
# Android
flutter build apk --release

# iOS (Mac gerekli)
flutter build ios --release
```

## 📂 Proje Yapısı

```
lib/
├── main.dart                 # Uygulama giriş noktası
├── firebase_options.dart     # Firebase yapılandırması
├── models/                   # Veri modelleri
│   ├── order_model.dart
│   ├── courier_model.dart
│   └── location_model.dart
├── providers/                # State management
│   ├── app_provider.dart
│   ├── location_provider.dart
│   └── order_provider.dart
├── services/                 # İş mantığı
│   ├── auth_service.dart
│   ├── location_service.dart
│   ├── notification_service.dart
│   └── api_service.dart
├── screens/                  # Ekranlar
│   ├── login_screen.dart
│   ├── home_screen.dart
│   ├── order_detail_screen.dart
│   └── map_screen.dart
└── widgets/                  # Özel widget'lar
    ├── order_card.dart
    ├── status_badge.dart
    └── loading_indicator.dart
```

## 🔧 Gerekli İzinler

### Android (AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

### iOS (Info.plist)
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Kurye takibi için konum erişimi gerekli</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Arka planda konum takibi için erişim gerekli</string>
```

## 🚀 Çalıştırma

```bash
# Geliştirme modu
flutter run

# Belirli cihazda
flutter run -d emulator-5554  # Android
flutter run -d iphone         # iOS

# Profil modu (performans testi)
flutter run --profile
```

## 📦 Dağıtım

### Android
```bash
# APK
flutter build apk --release

# App Bundle (Google Play)
flutter build appbundle --release
```

### iOS
```bash
# Xcode ile arşivleme
flutter build ios --release

# Sonra Xcode > Product > Archive
```

## 📝 Önemli Notlar

- **API URL**: `lib/services/api_service.dart` içinde `api.paketciniz.com` olarak ayarlı
- **WebSocket**: `wss://api.paketciniz.com/ws`
- **Konum Aralığı**: Varsayılan 5 saniye
- **Bildirim Kanalı**: `paketci_channel`

## 🔒 Güvenlik

- API token'lar `SharedPreferences` ile saklanır (production'da encrypted storage önerilir)
- SSL pinning eklenebilir
- Root/jailbreak detection eklenebilir

## 🐛 Hata Ayıklama

```bash
# Logları izle
flutter logs

# Verbose mod
flutter run --verbose

# Hot restart (kod değişikliğinde)
R tuşuna bas (çalışırken)
```

## 📞 Destek

Sorun yaşarsanız: `support@paketciniz.com`
