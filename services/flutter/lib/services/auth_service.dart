import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/courier_model.dart';

class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  static const String _baseUrl = 'https://api.paketciniz.com/api';
  static const String _tokenKey = 'auth_token';
  static const String _courierKey = 'courier_data';

  String? _token;
  Courier? _courier;

  String? get token => _token;
  Courier? get courier => _courier;
  bool get isLoggedIn => _token != null;

  // Token'ı yükle
  Future<void> loadToken() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString(_tokenKey);
    
    final courierJson = prefs.getString(_courierKey);
    if (courierJson != null) {
      _courier = Courier.fromJson(jsonDecode(courierJson));
    }
  }

  // Giriş yap
  Future<bool> login(String phone, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/auth/courier/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'phone': phone,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        _token = data['token'];
        _courier = Courier.fromJson(data['courier']);

        // Kaydet
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(_tokenKey, _token!);
        await prefs.setString(_courierKey, jsonEncode(_courier!.toJson()));

        return true;
      }
      return false;
    } catch (e) {
      debugPrint('Login hatası: $e');
      return false;
    }
  }

  // Çıkış yap
  Future<void> logout() async {
    _token = null;
    _courier = null;

    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_courierKey);
  }

  // HTTP header'ları
  Map<String, String> get headers => {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer $_token',
  };
}
