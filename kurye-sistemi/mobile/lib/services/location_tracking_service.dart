import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:web_socket_channel/io.dart';
import 'package:just_audio/just_audio.dart';
import 'package:battery_plus/battery_plus.dart';

class LocationTrackingService {
  static final LocationTrackingService _instance = LocationTrackingService._internal();
  factory LocationTrackingService() => _instance;
  LocationTrackingService._internal();

  Timer? _locationTimer;
  WebSocketChannel? _webSocketChannel;
  final Battery _battery = Battery();
  final AudioPlayer _audioPlayer = AudioPlayer();
  
  String? _apiKey;
  String? _courierId;
  String? _restaurantId;
  bool _isTracking = false;

  // Konfigürasyon
  static const String _webSocketUrl = 'wss://api.paketci.app/ws';
  static const Duration _updateInterval = Duration(seconds: 5);

  // Başlat
  Future<void> startTracking() async {
    if (_isTracking) return;

    final prefs = await SharedPreferences.getInstance();
    _apiKey = prefs.getString('api_key');
    _courierId = prefs.getString('courier_id');
    _restaurantId = prefs.getString('restaurant_id');

    if (_apiKey == null || _courierId == null) {
      throw Exception('API Key veya Courier ID bulunamadı');
    }

    // Konum izni kontrolü
    await _checkLocationPermission();

    // WebSocket bağlantısı
    await _connectWebSocket();

    // Konum takibi başlat
    _startLocationUpdates();

    _isTracking = true;
    debugPrint('Location tracking started');
  }

  // Durdur
  void stopTracking() {
    _locationTimer?.cancel();
    _webSocketChannel?.sink.close();
    _isTracking = false;
    debugPrint('Location tracking stopped');
  }

  // Konum izni kontrolü
  Future<void> _checkLocationPermission() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      throw Exception('Konum servisi kapalı');
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw Exception('Konum izni reddedildi');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      throw Exception('Konum izni kalıcı olarak reddedildi');
    }
  }

  // WebSocket bağlantısı
  Future<void> _connectWebSocket() async {
    try {
      _webSocketChannel = IOWebSocketChannel.connect(
        Uri.parse('$_webSocketUrl?token=$_apiKey'),
        pingInterval: const Duration(seconds: 30),
      );

      _webSocketChannel!.stream.listen(
        (message) => _handleWebSocketMessage(message),
        onError: (error) {
          debugPrint('WebSocket error: $error');
          _reconnectWebSocket();
        },
        onDone: () {
          debugPrint('WebSocket closed');
          _reconnectWebSocket();
        },
      );

      // Bağlantı mesajı gönder
      _webSocketChannel!.sink.add(jsonEncode({
        'type': 'courier:connect',
        'courierId': _courierId,
        'restaurantId': _restaurantId,
      }));

      debugPrint('WebSocket connected');
    } catch (e) {
      debugPrint('WebSocket connection error: $e');
      _reconnectWebSocket();
    }
  }

  // Yeniden bağlan
  void _reconnectWebSocket() {
    Future.delayed(const Duration(seconds: 5), () {
      if (_isTracking) {
        _connectWebSocket();
      }
    });
  }

  // Konum güncellemelerini başlat
  void _startLocationUpdates() {
    _locationTimer = Timer.periodic(_updateInterval, (_) async {
      await _sendLocationUpdate();
    });
  }

  // Konum gönder
  Future<void> _sendLocationUpdate() async {
    try {
      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.best,
      );

      final batteryLevel = await _battery.batteryLevel;

      // Sahte konum kontrolü
      if (_isMockLocation(position)) {
        debugPrint('Mock location detected, skipping');
        return;
      }

      final payload = {
        'type': 'location:update',
        'courierId': _courierId,
        'latitude': position.latitude,
        'longitude': position.longitude,
        'accuracy': position.accuracy,
        'altitude': position.altitude,
        'speed': position.speed * 3.6, // m/s to km/h
        'heading': position.heading,
        'batteryLevel': batteryLevel,
        'timestamp': DateTime.now().toIso8601String(),
      };

      _webSocketChannel?.sink.add(jsonEncode(payload));
      debugPrint('Location sent: ${position.latitude}, ${position.longitude}');
    } catch (e) {
      debugPrint('Location update error: $e');
    }
  }

  // Sahte konum kontrolü
  bool _isMockLocation(Position position) {
    if (position.isMocked) return true;
    if (position.accuracy < 5) return true;
    if (position.speed > 120 / 3.6) return true; // 120 km/h üstü şüpheli
    return false;
  }

  // WebSocket mesajlarını işle
  void _handleWebSocketMessage(String message) {
    try {
      final data = jsonDecode(message);
      final type = data['type'];

      switch (type) {
        case 'order:assigned':
          _playNotificationSound('new_order');
          _showLocalNotification(
            title: 'Yeni Sipariş',
            body: 'Sipariş #${data['orderId']} atandı',
          );
          break;

        case 'order:cancelled':
          _playNotificationSound('cancel');
          _showLocalNotification(
            title: 'Sipariş İptal',
            body: 'Sipariş #${data['orderId']} iptal edildi',
          );
          break;

        case 'break:approved':
          _showLocalNotification(
            title: 'Mola Onaylandı',
            body: 'Mola talebiniz onaylandı',
          );
          break;

        case 'location:ack':
          // Konum alındı onayı
          break;

        default:
          debugPrint('Unknown message type: $type');
      }
    } catch (e) {
      debugPrint('Message handling error: $e');
    }
  }

  // Bildirim sesi çal
  Future<void> _playNotificationSound(String type) async {
    try {
      final soundUrls = {
        'new_order': 'assets/sounds/new_order.mp3',
        'cancel': 'assets/sounds/cancel.mp3',
        'emergency': 'assets/sounds/emergency.mp3',
      };

      await _audioPlayer.setAsset(soundUrls[type] ?? soundUrls['new_order']!);
      await _audioPlayer.play();
    } catch (e) {
      debugPrint('Sound play error: $e');
    }
  }

  // Yerel bildirim göster
  void _showLocalNotification({required String title, required String body}) {
    // flutter_local_notifications kullanılarak implemente edilecek
    debugPrint('Notification: $title - $body');
  }

  // Acil durum butonu
  Future<void> sendEmergencyAlert(String type, {String? message}) async {
    final position = await Geolocator.getCurrentPosition();

    _webSocketChannel?.sink.add(jsonEncode({
      'type': 'emergency:alert',
      'courierId': _courierId,
      'emergencyType': type,
      'message': message,
      'location': {
        'lat': position.latitude,
        'lng': position.longitude,
      },
      'timestamp': DateTime.now().toIso8601String(),
    }));

    _playNotificationSound('emergency');
  }

  // Mola talebi gönder
  Future<void> requestBreak(String breakType) async {
    _webSocketChannel?.sink.add(jsonEncode({
      'type': 'break:request',
      'courierId': _courierId,
      'breakType': breakType,
      'timestamp': DateTime.now().toIso8601String(),
    }));
  }

  // Sipariş durumunu güncelle
  Future<void> updateOrderStatus(String orderId, String status, {String? note}) async {
    _webSocketChannel?.sink.add(jsonEncode({
      'type': 'order:status',
      'orderId': orderId,
      'status': status,
      'note': note,
      'timestamp': DateTime.now().toIso8601String(),
    }));
  }

  // FCM Token kaydet
  Future<void> registerFCMToken() async {
    try {
      final token = await FirebaseMessaging.instance.getToken();
      if (token != null) {
        final response = await http.post(
          Uri.parse('https://api.paketci.app/api/couriers/fcm-token'),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_apiKey',
          },
          body: jsonEncode({
            'courierId': _courierId,
            'fcmToken': token,
          }),
        );

        if (response.statusCode == 200) {
          debugPrint('FCM token registered');
        }
      }
    } catch (e) {
      debugPrint('FCM token registration error: $e');
    }
  }

  // Durum kontrolü
  bool get isTracking => _isTracking;
  bool get isConnected => _webSocketChannel != null;
}
