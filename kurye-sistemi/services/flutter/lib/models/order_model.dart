class Order {
  final String id;
  final String orderNumber;
  final String restaurantId;
  final String restaurantName;
  final String? restaurantPhone;
  final String customerName;
  final String customerPhone;
  final String customerAddress;
  final double? customerLat;
  final double? customerLng;
  final List<OrderItem> items;
  final double totalAmount;
  final String paymentMethod;
  final String status; // pending, assigned, picked_up, on_the_way, delivered, cancelled
  final DateTime createdAt;
  final DateTime? assignedAt;
  final DateTime? estimatedDeliveryTime;
  final String? note;
  final String? platform; // yemeksepeti, getir, trendyol, etc.

  Order({
    required this.id,
    required this.orderNumber,
    required this.restaurantId,
    required this.restaurantName,
    this.restaurantPhone,
    required this.customerName,
    required this.customerPhone,
    required this.customerAddress,
    this.customerLat,
    this.customerLng,
    required this.items,
    required this.totalAmount,
    required this.paymentMethod,
    required this.status,
    required this.createdAt,
    this.assignedAt,
    this.estimatedDeliveryTime,
    this.note,
    this.platform,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'],
      orderNumber: json['orderNumber'],
      restaurantId: json['restaurantId'],
      restaurantName: json['restaurantName'],
      restaurantPhone: json['restaurantPhone'],
      customerName: json['customerName'],
      customerPhone: json['customerPhone'],
      customerAddress: json['customerAddress'],
      customerLat: json['customerLat']?.toDouble(),
      customerLng: json['customerLng']?.toDouble(),
      items: (json['items'] as List).map((i) => OrderItem.fromJson(i)).toList(),
      totalAmount: json['totalAmount'].toDouble(),
      paymentMethod: json['paymentMethod'],
      status: json['status'],
      createdAt: DateTime.parse(json['createdAt']),
      assignedAt: json['assignedAt'] != null ? DateTime.parse(json['assignedAt']) : null,
      estimatedDeliveryTime: json['estimatedDeliveryTime'] != null 
          ? DateTime.parse(json['estimatedDeliveryTime']) 
          : null,
      note: json['note'],
      platform: json['platform'],
    );
  }

  Map<String, dynamic> toJson() => {
    return {
      'id': id,
      'orderNumber': orderNumber,
      'restaurantId': restaurantId,
      'restaurantName': restaurantName,
      'restaurantPhone': restaurantPhone,
      'customerName': customerName,
      'customerPhone': customerPhone,
      'customerAddress': customerAddress,
      'customerLat': customerLat,
      'customerLng': customerLng,
      'items': items.map((i) => i.toJson()).toList(),
      'totalAmount': totalAmount,
      'paymentMethod': paymentMethod,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
      'assignedAt': assignedAt?.toIso8601String(),
      'estimatedDeliveryTime': estimatedDeliveryTime?.toIso8601String(),
      'note': note,
      'platform': platform,
    };
  };

  String get statusText {
    switch (status) {
      case 'pending':
        return 'Bekliyor';
      case 'assigned':
        return 'Atandı';
      case 'picked_up':
        return 'Alındı';
      case 'on_the_way':
        return 'Yolda';
      case 'delivered':
        return 'Teslim Edildi';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return status;
    }
  }

  String get platformName {
    switch (platform) {
      case 'yemeksepeti':
        return 'Yemeksepeti';
      case 'getir':
        return 'Getir';
      case 'trendyol':
        return 'Trendyol';
      case 'migros':
        return 'Migros';
      case 'fuudy':
        return 'Fuudy';
      default:
        return platform ?? 'Restoran';
    }
  }

  String get platformIcon {
    switch (platform) {
      case 'yemeksepeti':
        return '🍽️';
      case 'getir':
        return '🛵';
      case 'trendyol':
        return '🟠';
      case 'migros':
        return '🦁';
      case 'fuudy':
        return '🍔';
      default:
        return '📦';
    }
  }
}

class OrderItem {
  final String id;
  final String name;
  final int quantity;
  final double unitPrice;
  final double totalPrice;
  final List<String>? options;
  final String? note;

  OrderItem({
    required this.id,
    required this.name,
    required this.quantity,
    required this.unitPrice,
    required this.totalPrice,
    this.options,
    this.note,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    return OrderItem(
      id: json['id'],
      name: json['name'],
      quantity: json['quantity'],
      unitPrice: json['unitPrice'].toDouble(),
      totalPrice: json['totalPrice'].toDouble(),
      options: json['options'] != null 
          ? List<String>.from(json['options']) 
          : null,
      note: json['note'],
    );
  }

  Map<String, dynamic> toJson() => {
    return {
      'id': id,
      'name': name,
      'quantity': quantity,
      'unitPrice': unitPrice,
      'totalPrice': totalPrice,
      'options': options,
      'note': note,
    };
  };
}
