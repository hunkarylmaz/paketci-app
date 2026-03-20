import 'package:flutter/foundation.dart';
import '../services/location_service.dart';
import '../services/location_service.dart';

class LocationProvider extends ChangeNotifier {
  final LocationService _locationService = LocationService();
  
  bool _isTracking = false;
  bool _isLoading = false;
  String? _error;
  LocationUpdate? _lastLocation;

  bool get isTracking => _isTracking;
  bool get isLoading => _isLoading;
  String? get error => _error;
  LocationUpdate? get lastLocation => _lastLocation;

  LocationProvider() {
    _locationService.locationStream.listen((location) {
      _lastLocation = location;
      notifyListeners();
    });
  }

  Future<void> startTracking() async {
    _isLoading = true;
    notifyListeners();

    try {
      await _locationService.startTracking();
      _isTracking = true;
      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> stopTracking() async {
    _isLoading = true;
    notifyListeners();

    try {
      await _locationService.stopTracking();
      _isTracking = false;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> checkPermission() async {
    return await _locationService.checkPermission();
  }
}
