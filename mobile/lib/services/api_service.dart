import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/delivery.dart';
import '../models/shift.dart';

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:4000'; // Android emulator
  // static const String baseUrl = 'http://localhost:4000'; // iOS simulator
  
  static String? _token;

  static void setToken(String token) {
    _token = token;
  }

  static Map<String, String> get headers => {
    'Content-Type': 'application/json',
    if (_token != null) 'Authorization': 'Bearer $_token',
  };

  // Auth
  static Future<Map<String, dynamic>?> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        _token = data['access_token'];
        return data;
      }
      return null;
    } catch (e) {
      print('Login error: $e');
      return null;
    }
  }

  // Deliveries
  static Future<List<Delivery>> getMyDeliveries() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/deliveries/my'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Delivery.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      print('Get deliveries error: $e');
      return [];
    }
  }

  static Future<bool> updateDeliveryStatus(String deliveryId, String status) async {
    try {
      final response = await http.patch(
        Uri.parse('$baseUrl/deliveries/$deliveryId/status'),
        headers: headers,
        body: jsonEncode({'status': status}),
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Update status error: $e');
      return false;
    }
  }

  static Future<bool> acceptDelivery(String deliveryId) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/deliveries/$deliveryId/accept'),
        headers: headers,
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Accept delivery error: $e');
      return false;
    }
  }

  static Future<bool> completeDelivery(String deliveryId, {String? photoUrl}) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/deliveries/$deliveryId/complete'),
        headers: headers,
        body: jsonEncode({'deliveryPhoto': photoUrl}),
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Complete delivery error: $e');
      return false;
    }
  }

  // Shifts
  static Future<Shift?> getCurrentShift() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/shifts/current'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        return Shift.fromJson(jsonDecode(response.body));
      }
      return null;
    } catch (e) {
      print('Get current shift error: $e');
      return null;
    }
  }

  static Future<bool> startShift(String shiftId, double latitude, double longitude) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/shifts/$shiftId/start'),
        headers: headers,
        body: jsonEncode({'latitude': latitude, 'longitude': longitude}),
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Start shift error: $e');
      return false;
    }
  }

  static Future<bool> endShift(String shiftId, double latitude, double longitude) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/shifts/$shiftId/end'),
        headers: headers,
        body: jsonEncode({'latitude': latitude, 'longitude': longitude}),
      );
      return response.statusCode == 200;
    } catch (e) {
      print('End shift error: $e');
      return false;
    }
  }

  // Location Update
  static Future<bool> updateLocation(double latitude, double longitude) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/couriers/location'),
        headers: headers,
        body: jsonEncode({'latitude': latitude, 'longitude': longitude}),
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Update location error: $e');
      return false;
    }
  }
}
