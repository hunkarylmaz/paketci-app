import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../providers/location_provider.dart';
import '../providers/order_provider.dart';
import '../services/notification_service.dart';
import '../models/order_model.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    _setupNotifications();
    _checkLocationPermission();
  }

  void _setupNotifications() {
    final notificationService = NotificationService();
    
    notificationService.setOnOrderAssigned((data) {
      // Yeni sipariş bildirimi
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Yeni sipariş: #${data['orderId']}'),
            backgroundColor: Colors.green,
          ),
        );
      }
    });
  }

  Future<void> _checkLocationPermission() async {
    final locationProvider = context.read<LocationProvider>();
    final hasPermission = await locationProvider.checkPermission();
    
    if (!hasPermission && mounted) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Konum İzni Gerekli'),
          content: const Text('Kurye takibi için konum izni vermeniz gerekiyor.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Tamam'),
            ),
          ],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Paketçi Kurye'),
        actions: [
          // Konum durumu
          Consumer<LocationProvider>(
            builder: (context, provider, child) {
              return IconButton(
                icon: Icon(
                  provider.isTracking ? Icons.location_on : Icons.location_off,
                  color: provider.isTracking ? Colors.green : Colors.grey,
                ),
                onPressed: () async {
                  if (provider.isTracking) {
                    await provider.stopTracking();
                  } else {
                    await provider.startTracking();
                  }
                },
              );
            },
          ),
          // Çıkış
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await context.read<AppProvider>().logout();
              if (mounted) {
                Navigator.pushReplacementNamed(context, '/');
              }
            },
          ),
        ],
      ),
      body: _buildBody(),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.delivery_dining),
            label: 'Siparişler',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.map),
            label: 'Harita',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.history),
            label: 'Geçmiş',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profil',
          ),
        ],
      ),
    );
  }

  Widget _buildBody() {
    switch (_currentIndex) {
      case 0:
        return const OrdersTab();
      case 1:
        return const MapTab();
      case 2:
        return const HistoryTab();
      case 3:
        return const ProfileTab();
      default:
        return const OrdersTab();
    }
  }
}

// Siparişler Sekmesi
class OrdersTab extends StatelessWidget {
  const OrdersTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<OrderProvider>(
      builder: (context, provider, child) {
        final activeOrders = provider.activeOrders;

        if (activeOrders.isEmpty) {
          return const Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.inbox, size: 64, color: Colors.grey),
                SizedBox(height: 16),
                Text(
                  'Aktif sipariş yok',
                  style: TextStyle(fontSize: 18, color: Colors.grey),
                ),
              ],
            ),
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: activeOrders.length,
          itemBuilder: (context, index) {
            final order = activeOrders[index];
            return OrderCard(order: order);
          },
        );
      },
    );
  }
}

// Sipariş Kartı
class OrderCard extends StatelessWidget {
  final Order order;

  const OrderCard({super.key, required this.order});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                Text(
                  order.platformIcon,
                  style: const TextStyle(fontSize: 24),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        order.restaurantName,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      Text(
                        '#${order.orderNumber}',
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getStatusColor(order.status),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    order.statusText,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const Divider(height: 24),

            // Müşteri
            Row(
              children: [
                const Icon(Icons.person_outline, size: 18),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    order.customerName,
                    style: const TextStyle(fontWeight: FontWeight.w500),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),

            // Adres
            Row(
              children: [
                const Icon(Icons.location_on_outlined, size: 18, color: Colors.red),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    order.customerAddress,
                    style: TextStyle(color: Colors.grey[700]),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),

            // Telefon
            Row(
              children: [
                const Icon(Icons.phone_outlined, size: 18),
                const SizedBox(width: 8),
                Text(order.customerPhone),
              ],
            ),
            const Divider(height: 24),

            // Footer
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '₺${order.totalAmount.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  order.paymentMethod,
                  style: TextStyle(color: Colors.grey[600]),
                ),
              ],
            ),

            // Aksiyon butonları
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      // Telefon et
                    },
                    icon: const Icon(Icons.phone),
                    label: const Text('Ara'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      // Navigasyon
                    },
                    icon: const Icon(Icons.navigation),
                    label: const Text('Navigasyon'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'pending':
        return Colors.orange;
      case 'assigned':
        return Colors.blue;
      case 'picked_up':
        return Colors.purple;
      case 'on_the_way':
        return Colors.green;
      case 'delivered':
        return Colors.grey;
      case 'cancelled':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}

// Harita Sekmesi
class MapTab extends StatelessWidget {
  const MapTab({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text('Harita görünümü yakında...'),
    );
  }
}

// Geçmiş Sekmesi
class HistoryTab extends StatelessWidget {
  const HistoryTab({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text('Geçmiş siparişler yakında...'),
    );
  }
}

// Profil Sekmesi
class ProfileTab extends StatelessWidget {
  const ProfileTab({super.key});

  @override
  Widget build(BuildContext context) {
    final courier = context.watch<AppProvider>().courier;

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Profil kartı
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 50,
                    backgroundColor: Theme.of(context).colorScheme.primary,
                    child: Text(
                      courier?.name.substring(0, 1) ?? 'K',
                      style: const TextStyle(
                        fontSize: 36,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    courier?.name ?? 'Kurye',
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    courier?.phone ?? '',
                    style: TextStyle(color: Colors.grey[600]),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 16),

          // İstatistikler
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  _buildStatRow('Toplam Teslimat', '${courier?.totalDeliveries ?? 0}'),
                  const Divider(),
                  _buildStatRow('Puan', '${courier?.rating ?? 0.0} ⭐'),
                  const Divider(),
                  _buildStatRow('Durum', courier?.statusText ?? 'Bilinmiyor'),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}
