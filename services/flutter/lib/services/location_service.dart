import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:geolocator/geolocator.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import '../models/location_model.dart';

class LocationService {
  static final LocationService _instance = LocationService._internal();
  factory LocationService() => _instance;
  LocationService._internal();

  StreamSubscription<Position>? _positionStream;
  WebSocketChannel? _webSocket;
  Timer? _heartbeatTimer;
  
  bool _isTracking = false;
  String? _apiKey;
  String? _courierId;
  String? _restaurantId;
  
  final _locationController = StreamController<LocationUpdate>.broadcast();
  Stream<LocationUpdate> get locationStream => _locationController.stream;
  
  bool get isTracking => _isTracking;

  // Konum izni kontrolü
  Future<bool> checkPermission() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return false;
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return false;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      return false;
    }

    return true;
  }

  // Ayarları yükle
  Future<void> loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    _apiKey = prefs.getString('api_key');
    _courierId = prefs.getString('courier_id');
    _restaurantId = prefs.getString('restaurant_id');
  }

  // Konum takibini başlat
  Future<void> startTracking() async {
    if (_isTracking) return;
    
    await loadSettings();
    
    if (_apiKey == null || _courierId == null) {
      throw Exception('API key veya kurye ID eksik');
    }

    final hasPermission = await checkPermission();
    if (!hasPermission) {
      throw Exception('Konum izni verilmedi');
    }

    // WebSocket bağlantısı
    await _connectWebSocket();

    // Konum dinleyicisi
    const locationSettings = LocationSettings(
      accuracy: LocationAccuracy.high,
      distanceFilter: 10, // 10 metre
    );

    _positionStream = Geolocator.getPositionStream(
      locationSettings: locationSettings,
    ).listen(
      (Position position) {
        _handleLocationUpdate(position);
      },
      onError: (error) {
        debugPrint('Konum hatası: $error');
      },
    );

    // Heartbeat timer
    _heartbeatTimer = Timer.periodic(
      const Duration(seconds: 30),
      (_) => _sendHeartbeat(),
    );

    _isTracking = true;
  }

  // Konum takibini durdur
  Future<void> stopTracking() async {
    await _positionStream?.cancel();
    _heartbeatTimer?.cancel();
    _webSocket?.sink.close();
    
    _isTracking = false;
  }

  // Konum güncellemesini işle
  void _handleLocationUpdate(Position position) async {
    final update = LocationUpdate(
      courierId: _courierId!,
      latitude: position.latitude,
      longitude: position.longitude,
      accuracy: position.accuracy,
      altitude: position.altitude,
      speed: position.speed * 3.6, // m/s to km/h
      heading: position.heading,
      timestamp: DateTime.now(),
      batteryLevel: await _getBatteryLevel(),
    );

    _locationController.add(update);
    
    // WebSocket üzerinden gönder
    _sendLocationViaWebSocket(update);
  }

  // WebSocket bağlantısı
  Future<void> _connectWebSocket() async {
    try {
      final wsUrl = 'wss://api.paketciniz.com/ws?token=$_apiKey';
      _webSocket = WebSocketChannel.connect(Uri.parse(wsUrl));

      _webSocket!.stream.listen(
        (message) {
          _handleWebSocketMessage(message);
        },
        onError: (error) {
          debugPrint('WebSocket hatası: $error');
          _reconnectWebSocket();
        },
        onDone: () {
          debugPrint('WebSocket kapandı');
          _reconnectWebSocket();
        },
      );

      // Bağlantı mesajı
      _webSocket!.sink.add(jsonEncode({
        'type': 'courier:connect',
        'courierId': _courierId,
        'restaurantId': _restaurantId,
      }));
    } catch (e) {
      debugPrint('WebSocket bağlantı hatası: $e');
    }
  }

  // WebSocket yeniden bağlan
  Future<void> _reconnectWebSocket() async {
    await Future.delayed(const Duration(seconds: 5));
    if (_isTracking) {
      await _connectWebSocket();
    }
  }

  // WebSocket mesajı işle
  void _handleWebSocketMessage(String message) {
    try {
      final data = jsonDecode(message);
      final type = data['type'];

      switch (type) {
        case 'order:assigned':
          // Yeni sipariş atandı
          break;
        case 'order:cancelled':
          // Sipariş iptal edildi
          break;
        case 'break:approved':
          // Mola onaylandı
          break;
        case 'emergency:alert':
          // Acil durum
          break;
      }
    } catch (e) {
      debugPrint('Mesaj işleme hatası: $e');
    }
  }

  // Konum verisini WebSocket ile gönder
  void _sendLocationViaWebSocket(LocationUpdate location) {
    if (_webSocket == null) return;

    final payload = {
      'type': 'location:update',
      'courierId': location.courierId,
      'latitude': location.latitude,
      'longitude': location.longitude,
      'accuracy': location.accuracy,
      'altitude': location.altitude,
      'speed': location.speed,
      'heading': location.heading,
      'batteryLevel': location.batteryLevel,
      'timestamp': location.timestamp.toIso8601String(),
    };

    _webSocket!.sink.add(jsonEncode(payload));
  }

  // Heartbeat gönder
  void _sendHeartbeat() {
    _webSocket?.sink.add(jsonEncode({
      'type': 'ping',
      'timestamp': DateTime.now().toIso8601String(),
    }));
  }

  // Batarya seviyesini al
  Future<int> _getBatteryLevel() async {
    // Platform specific implementation needed
    return 100;
  }
}

class LocationUpdate {
  final String courierId;
  final double latitude;
  final double longitude;
  final double accuracy;
  final double altitude;
  final double speed;
  final double heading;
  final DateTime timestamp;
  final int batteryLevel;

  LocationUpdate({
    required this.courierId,
    required this.latitude,
    required this.longitude,
    required this.accuracy,
    required this.altitude,
    required this.speed,
    required this.heading,
    required this.timestamp,
    required this.batteryLevel,
  });
}