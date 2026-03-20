import 'dart:convert';
import 'dart:io';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:shared_preferences/shared_preferences.dart';

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _localNotifications = FlutterLocalNotificationsPlugin();
  
  Function(Map<String, dynamic>)? _onOrderAssigned;
  Function(Map<String, dynamic>)? _onOrderCancelled;
  Function(Map<String, dynamic>)? _onBreakApproved;
  Function(Map<String, dynamic>)? _onEmergencyAlert;

  // Callback setter'lar
  void setOnOrderAssigned(Function(Map<String, dynamic>) callback) => _onOrderAssigned = callback;
  void setOnOrderCancelled(Function(Map<String, dynamic>) callback) => _onOrderCancelled = callback;
  void setOnBreakApproved(Function(Map<String, dynamic>) callback) => _onBreakApproved = callback;
  void setOnEmergencyAlert(Function(Map<String, dynamic>) callback) => _onEmergencyAlert = callback;

  // Bildirim servisini başlat
  Future<void> init() async {
    // İzinleri iste
    await _requestPermissions();
    
    // FCM token al
    await _getFCMToken();
    
    // Local notifications ayarla
    await _initLocalNotifications();
    
    // FCM dinleyicileri
    _setupFCMListeners();
  }

  // İzinleri iste
  Future<void> _requestPermissions() async {
    await _firebaseMessaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
      provisional: false,
    );
  }

  // FCM Token al ve kaydet
  Future<void> _getFCMToken() async {
    try {
      final token = await _firebaseMessaging.getToken();
      if (token != null) {
        debugPrint('FCM Token: $token');
        
        // Token'ı kaydet
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('fcm_token', token);
        
        // Backend'e gönder
        await _sendTokenToServer(token);
      }

      // Token yenilenme dinleyicisi
      _firebaseMessaging.onTokenRefresh.listen((newToken) async {
        debugPrint('FCM Token yenilendi: $newToken');
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('fcm_token', newToken);
        await _sendTokenToServer(newToken);
      });
    } catch (e) {
      debugPrint('FCM Token hatası: $e');
    }
  }

  // Token'ı backend'e gönder
  Future<void> _sendTokenToServer(String token) async {
    // API çağrısı yapılacak
    debugPrint('Token backend\'e gönderiliyor: $token');
  }

  // Local notifications başlat
  Future<void> _initLocalNotifications() async {
    const androidSettings = AndroidInitializationSettings('@drawable/ic_notification');
    const iosSettings = DarwinInitializationSettings(
      requestAlertPermission: false,
      requestBadgePermission: false,
      requestSoundPermission: false,
    );
    
    const initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    await _localNotifications.initialize(
      initSettings,
      onDidReceiveNotificationResponse: (NotificationResponse response) {
        _handleNotificationTap(response.payload);
      },
    );
  }

  // FCM dinleyicileri
  void _setupFCMListeners() {
    // Foreground mesajları
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      debugPrint('Foreground mesaj alındı: ${message.notification?.title}');
      _handleFCMMessage(message);
    });

    // Background mesajları (app açıldığında tetiklenir)
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      debugPrint('Background mesaj tıklandı: ${message.notification?.title}');
      _handleFCMMessage(message);
    });
  }

  // FCM mesajını işle
  void _handleFCMMessage(RemoteMessage message) {
    final data = message.data;
    final type = data['type'];

    // Local notification göster
    _showLocalNotification(
      title: message.notification?.title ?? 'Paketçi',
      body: message.notification?.body ?? '',
      payload: jsonEncode(data),
    );

    // Callback'leri çağır
    switch (type) {
      case 'order:assigned':
        _onOrderAssigned?.call(data);
        break;
      case 'order:cancelled':
        _onOrderCancelled?.call(data);
        break;
      case 'break:approved':
        _onBreakApproved?.call(data);
        break;
      case 'emergency:alert':
        _onEmergencyAlert?.call(data);
        break;
    }
  }

  // Local notification göster
  Future<void> _showLocalNotification({
    required String title,
    required String body,
    String? payload,
  }) async {
    const androidDetails = AndroidNotificationDetails(
      'paketci_channel',
      'Paketçi Bildirimleri',
      channelDescription: 'Kurye bildirim kanalı',
      importance: Importance.high,
      priority: Priority.high,
      showWhen: true,
      enableVibration: true,
      enableLights: true,
      icon: '@drawable/ic_notification',
    );

    const iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    const notificationDetails = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _localNotifications.show(
      DateTime.now().millisecond,
      title,
      body,
      notificationDetails,
      payload: payload,
    );
  }

  // Bildirim tıklama işleyici
  void _handleNotificationTap(String? payload) {
    if (payload == null) return;
    
    try {
      final data = jsonDecode(payload);
      // Navigasyon işlemleri burada yapılır
      debugPrint('Bildirim tıklandı: $data');
    } catch (e) {
      debugPrint('Payload parse hatası: $e');
    }
  }

  // Sipariş atama bildirimi
  Future<void> showOrderAssignedNotification({
    required String orderId,
    required String restaurantName,
    required String customerAddress,
  }) async {
    await _showLocalNotification(
      title: '📦 Yeni Sipariş!',
      body: '$restaurantName - $customerAddress',
      payload: jsonEncode({
        'type': 'order:assigned',
        'orderId': orderId,
      }),
    );
  }

  // Acil durum bildirimi
  Future<void> showEmergencyNotification({
    required String courierName,
    required String location,
  }) async {
    await _showLocalNotification(
      title: '🚨 ACİL DURUM!',
      body: '$courierName - $location',
      payload: jsonEncode({
        'type': 'emergency:alert',
      }),
    );
  }
}

// Background handler (bu fonksiyon global olmalı)
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  debugPrint('Background mesaj: ${message.messageId}');
}