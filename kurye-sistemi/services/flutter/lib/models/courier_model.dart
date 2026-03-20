class Courier {
  final String id;
  final String name;
  final String phone;
  final String email;
  final String? avatar;
  final String status; // online, offline, on_break, busy
  final bool isActive;
  final String? vehicleType;
  final String? licensePlate;
  final double? rating;
  final int totalDeliveries;
  final DateTime? lastLocationAt;
  final double? lastLat;
  final double? lastLng;

  Courier({
    required this.id,
    required this.name,
    required this.phone,
    required this.email,
    this.avatar,
    required this.status,
    required this.isActive,
    this.vehicleType,
    this.licensePlate,
    this.rating,
    required this.totalDeliveries,
    this.lastLocationAt,
    this.lastLat,
    this.lastLng,
  });

  factory Courier.fromJson(Map<String, dynamic> json) {
    return Courier(
      id: json['id'],
      name: json['name'],
      phone: json['phone'],
      email: json['email'],
      avatar: json['avatar'],
      status: json['status'],
      isActive: json['isActive'] ?? true,
      vehicleType: json['vehicleType'],
      licensePlate: json['licensePlate'],
      rating: json['rating']?.toDouble(),
      totalDeliveries: json['totalDeliveries'] ?? 0,
      lastLocationAt: json['lastLocationAt'] != null 
          ? DateTime.parse(json['lastLocationAt']) 
          : null,
      lastLat: json['lastLat']?.toDouble(),
      lastLng: json['lastLng']?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() => {
    return {
      'id': id,
      'name': name,
      'phone': phone,
      'email': email,
      'avatar': avatar,
      'status': status,
      'isActive': isActive,
      'vehicleType': vehicleType,
      'licensePlate': licensePlate,
      'rating': rating,
      'totalDeliveries': totalDeliveries,
      'lastLocationAt': lastLocationAt?.toIso8601String(),
      'lastLat': lastLat,
      'lastLng': lastLng,
    };
  };

  String get statusText {
    switch (status) {
      case 'online':
        return 'Çevrimiçi';
      case 'offline':
        return 'Çevrimdışı';
      case 'on_break':
        return 'Molada';
      case 'busy':
        return 'Meşgul';
      default:
        return status;
    }
  }

  String get vehicleIcon {
    switch (vehicleType) {
      case 'motorcycle':
        return '🛵';
      case 'car':
        return '🚗';
      case 'bicycle':
        return '🚲';
      case 'scooter':
        return '🛴';
      default:
        return '🛵';
    }
  }
}
