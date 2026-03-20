import 'package:flutter/foundation.dart';
import '../models/order_model.dart';

class OrderProvider extends ChangeNotifier {
  List<Order> _orders = [];
  Order? _currentOrder;
  bool _isLoading = false;
  String? _error;

  List<Order> get orders => _orders;
  Order? get currentOrder => _currentOrder;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Aktif siparişler (pending, assigned, picked_up, on_the_way)
  List<Order> get activeOrders => 
      _orders.where((o) => ['pending', 'assigned', 'picked_up', 'on_the_way'].contains(o.status)).toList();

  // Tamamlanmış siparişler
  List<Order> get completedOrders => 
      _orders.where((o) => o.status == 'delivered').toList();

  // Bugünkü siparişler
  List<Order> get todayOrders => 
      _orders.where((o) => 
        o.createdAt.day == DateTime.now().day &&
        o.createdAt.month == DateTime.now().month
      ).toList();

  void setOrders(List<Order> orders) {
    _orders = orders;
    notifyListeners();
  }

  void addOrder(Order order) {
    _orders.insert(0, order);
    notifyListeners();
  }

  void updateOrder(Order updatedOrder) {
    final index = _orders.indexWhere((o) => o.id == updatedOrder.id);
    if (index != -1) {
      _orders[index] = updatedOrder;
      notifyListeners();
    }
  }

  void setCurrentOrder(Order? order) {
    _currentOrder = order;
    notifyListeners();
  }

  void setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  void setError(String? value) {
    _error = value;
    notifyListeners();
  }

  // Sipariş durumunu güncelle
  Future<void> updateOrderStatus(String orderId, String newStatus) async {
    final index = _orders.indexWhere((o) => o.id == orderId);
    if (index != -1) {
      final updated = Order(
        id: _orders[index].id,
        orderNumber: _orders[index].orderNumber,
        restaurantId: _orders[index].restaurantId,
        restaurantName: _orders[index].restaurantName,
        customerName: _orders[index].customerName,
        customerPhone: _orders[index].customerPhone,
        customerAddress: _orders[index].customerAddress,
        items: _orders[index].items,
        totalAmount: _orders[index].totalAmount,
        paymentMethod: _orders[index].paymentMethod,
        status: newStatus,
        createdAt: _orders[index].createdAt,
        note: _orders[index].note,
        platform: _orders[index].platform,
      );
      _orders[index] = updated;
      
      if (_currentOrder?.id == orderId) {
        _currentOrder = updated;
      }
      
      notifyListeners();
    }
  }
}
