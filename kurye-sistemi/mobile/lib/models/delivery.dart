class Delivery {
  final String id;
  final String trackingNumber;
  final String restaurantName;
  final String restaurantPhone;
  final String restaurantAddress;
  final double? restaurantLatitude;
  final double? restaurantLongitude;
  final String customerName;
  final String customerPhone;
  final String deliveryAddress;
  final double? latitude;
  final double? longitude;
  final double orderAmount;
  final String paymentType;
  final String status;
  final DateTime? createdAt;
  final String? notes;

  Delivery({
    required this.id,
    required this.trackingNumber,
    required this.restaurantName,
    required this.restaurantPhone,
    required this.restaurantAddress,
    this.restaurantLatitude,
    this.restaurantLongitude,
    required this.customerName,
    required this.customerPhone,
    required this.deliveryAddress,
    this.latitude,
    this.longitude,
    required this.orderAmount,
    required this.paymentType,
    required this.status,
    this.createdAt,
    this.notes,
  });

  factory Delivery.fromJson(Map<String, dynamic> json) {
    return Delivery(
      id: json['id'],
      trackingNumber: json['trackingNumber'],
      restaurantName: json['restaurantName'] ?? '',
      restaurantPhone: json['restaurantPhone'] ?? '',
      restaurantAddress: json['restaurantAddress'] ?? '',
      restaurantLatitude: json['restaurantLatitude']?.toDouble(),
      restaurantLongitude: json['restaurantLongitude']?.toDouble(),
      customerName: json['customerName'],
      customerPhone: json['customerPhone'],
      deliveryAddress: json['deliveryAddress'],
      orderAmount: double.parse(json['orderAmount'].toString()),
      paymentType: json['paymentType'],
      status: json['status'],
      latitude: json['latitude']?.toDouble(),
      longitude: json['longitude']?.toDouble(),
      createdAt: json['createdAt'] != null 
          ? DateTime.parse(json['createdAt']) 
          : null,
      notes: json['notes'],
    );
  }
}

class Courier {
  final String id;
  final String firstName;
  final String lastName;
  final String phone;
  final String? email;
  final String status;
  final String? vehicleType;
  final String? plateNumber;
  final double? rating;
  final int? totalDeliveries;

  Courier({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.phone,
    this.email,
    required this.status,
    this.vehicleType,
    this.plateNumber,
    this.rating,
    this.totalDeliveries,
  });

  String get fullName => '$firstName $lastName';

  factory Courier.fromJson(Map<String, dynamic> json) {
    return Courier(
      id: json['id'],
      firstName: json['firstName'],
      lastName: json['lastName'],
      phone: json['phone'],
      email: json['email'],
      status: json['status'] ?? 'offline',
      vehicleType: json['vehicleType'],
      plateNumber: json['plateNumber'],
      rating: json['rating']?.toDouble(),
      totalDeliveries: json['totalDeliveries'],
    );
  }
}
