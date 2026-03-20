import 'package:flutter/foundation.dart';
import '../services/auth_service.dart';
import '../models/courier_model.dart';

class AppProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();
  
  bool _isInitialized = false;
  bool _isLoading = false;
  String? _error;

  bool get isInitialized => _isInitialized;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isLoggedIn => _authService.isLoggedIn;
  Courier? get courier => _authService.courier;

  // Uygulama başlatma
  Future<void> initialize() async {
    _isLoading = true;
    notifyListeners();

    await _authService.loadToken();
    _isInitialized = true;
    _isLoading = false;
    notifyListeners();
  }

  // Giriş yap
  Future<bool> login(String phone, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    final success = await _authService.login(phone, password);
    
    if (!success) {
      _error = 'Telefon veya şifre hatalı';
    }
    
    _isLoading = false;
    notifyListeners();
    return success;
  }

  // Çıkış yap
  Future<void> logout() async {
    await _authService.logout();
    notifyListeners();
  }
}
