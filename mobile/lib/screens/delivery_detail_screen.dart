import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/delivery.dart';
import '../services/api_service.dart';

class DeliveryDetailScreen extends StatefulWidget {
  final Delivery delivery;

  const DeliveryDetailScreen({super.key, required this.delivery});

  @override
  State<DeliveryDetailScreen> createState() => _DeliveryDetailScreenState();
}

class _DeliveryDetailScreenState extends State<DeliveryDetailScreen> {
  bool _isLoading = false;

  Color _getStatusColor(String status) {
    switch (status) {
      case 'pending': return Colors.orange;
      case 'assigned': return const Color(0xFF1E40AF);
      case 'picked_up': return Colors.purple;
      case 'in_transit': return Colors.indigo;
      case 'delivered': return Colors.green;
      case 'cancelled': return Colors.red;
      default: return Colors.grey;
    }
  }

  String _getStatusText(String status) {
    switch (status) {
      case 'pending': return 'Bekliyor';
      case 'assigned': return 'Atandı';
      case 'picked_up': return 'Alındı';
      case 'in_transit': return 'Yolda';
      case 'delivered': return 'Teslim Edildi';
      case 'cancelled': return 'İptal';
      default: return status;
    }
  }

  Future<void> _updateStatus(String newStatus) async {
    setState(() => _isLoading = true);
    final success = await ApiService.updateDeliveryStatus(widget.delivery.id, newStatus);
    setState(() => _isLoading = false);
    
    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Durum güncellendi: ${_getStatusText(newStatus)}')),
      );
      Navigator.pop(context, true);
    }
  }

  Future<void> _completeDelivery() async {
    setState(() => _isLoading = true);
    final success = await ApiService.completeDelivery(widget.delivery.id);
    setState(() => _isLoading = false);
    
    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Teslimat tamamlandı!')),
      );
      Navigator.pop(context, true);
    }
  }

  // Telefon arama
  Future<void> _makePhoneCall(String phoneNumber) async {
    final Uri launchUri = Uri(
      scheme: 'tel',
      path: phoneNumber,
    );
    if (await canLaunchUrl(launchUri)) {
      await launchUrl(launchUri);
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Arama yapılamadı')),
        );
      }
    }
  }

  // Navigasyon
  Future<void> _openNavigation(String address, {double? lat, double? lng}) async {
    String url;
    if (lat != null && lng != null) {
      // Google Maps ile koordinat
      url = 'https://www.google.com/maps/dir/?api=1&destination=$lat,$lng';
    } else {
      // Google Maps ile adres
      url = 'https://www.google.com/maps/dir/?api=1&destination=${Uri.encodeComponent(address)}';
    }
    
    final Uri launchUri = Uri.parse(url);
    if (await canLaunchUrl(launchUri)) {
      await launchUrl(launchUri, mode: LaunchMode.externalApplication);
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Harita açılamadı')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final d = widget.delivery;
    
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E40AF),
        elevation: 0,
        title: const Text('Teslimat Detayı'),
        actions: [
          // Durum rengi göstergesi
          Center(
            child: Container(
              margin: const EdgeInsets.only(right: 16),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: _getStatusColor(d.status).withOpacity(0.2),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                _getStatusText(d.status),
                style: TextStyle(
                  color: _getStatusColor(d.status),
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
            ),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Takip No ve Tutar Kartı
                  _buildHeaderCard(d),
                  const SizedBox(height: 16),
                  
                  // Restoran Kartı - Aksiyon Butonlarıyla
                  _buildLocationCard(
                    title: 'Restoran',
                    icon: Icons.store_mall_directory_rounded,
                    iconColor: const Color(0xFF1E40AF),
                    name: d.restaurantName,
                    phone: d.restaurantPhone,
                    address: d.restaurantAddress,
                    onCall: () => _makePhoneCall(d.restaurantPhone),
                    onNavigate: () => _openNavigation(
                      d.restaurantAddress,
                      lat: d.restaurantLatitude,
                      lng: d.restaurantLongitude,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Müşteri Kartı - Aksiyon Butonlarıyla
                  _buildLocationCard(
                    title: 'Müşteri',
                    icon: Icons.person_pin_circle_rounded,
                    iconColor: Colors.green,
                    name: d.customerName,
                    phone: d.customerPhone,
                    address: d.deliveryAddress,
                    onCall: () => _makePhoneCall(d.customerPhone),
                    onNavigate: () => _openNavigation(
                      d.deliveryAddress,
                      lat: d.latitude,
                      lng: d.longitude,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Ödeme Bilgisi
                  _buildPaymentCard(d),
                  const SizedBox(height: 16),
                  
                  // Notlar
                  if (d.notes != null && d.notes!.isNotEmpty)
                    _buildNotesCard(d.notes!),
                  
                  const SizedBox(height: 24),
                  _buildActionButtons(),
                  const SizedBox(height: 32),
                ],
              ),
            ),
    );
  }

  Widget _buildHeaderCard(Delivery d) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1E40AF), Color(0xFF3B82F6)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1E40AF).withOpacity(0.3),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.receipt_long, color: Colors.white70, size: 20),
              const SizedBox(width: 8),
              Text(
                '#${d.trackingNumber}',
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                  letterSpacing: 1,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              '${d.orderAmount.toStringAsFixed(2)} TL',
              style: const TextStyle(
                fontSize: 28,
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLocationCard({
    required String title,
    required IconData icon,
    required Color iconColor,
    required String name,
    required String phone,
    required String address,
    required VoidCallback onCall,
    required VoidCallback onNavigate,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Başlık
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: iconColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(icon, color: iconColor, size: 20),
                ),
                const SizedBox(width: 12),
                Text(
                  title,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: Color(0xFF374151),
                  ),
                ),
              ],
            ),
          ),
          
          const Divider(height: 1),
          
          // İçerik
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // İsim
                Text(
                  name,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF111827),
                  ),
                ),
                const SizedBox(height: 12),
                
                // Telefon
                Row(
                  children: [
                    Icon(Icons.phone_outlined, size: 18, color: Colors.grey[500]),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        phone,
                        style: TextStyle(
                          fontSize: 15,
                          color: Colors.grey[700],
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                
                // Adres
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.location_on_outlined, size: 18, color: Colors.grey[500]),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        address,
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[600],
                          height: 1.4,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          
          // Butonlar
          Container(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: Row(
              children: [
                // Ara Butonu
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: onCall,
                    icon: const Icon(Icons.phone, size: 18),
                    label: const Text('ARA'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      elevation: 0,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                // Konuma Git Butonu
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: onNavigate,
                    icon: const Icon(Icons.navigation, size: 18),
                    label: const Text('YOL TARİFİ'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF1E40AF),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      elevation: 0,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentCard(Delivery d) {
    final bool isCash = d.paymentType == 'cash';
    
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: isCash ? Colors.green.withOpacity(0.1) : const Color(0xFF1E40AF).withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              isCash ? Icons.money : Icons.credit_card,
              color: isCash ? Colors.green : const Color(0xFF1E40AF),
              size: 24,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Ödeme Tipi',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[500],
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  isCash ? 'Nakit (Kapıda Ödeme)' : 'Kredi Kartı',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF374151),
                  ),
                ),
              ],
            ),
          ),
          if (isCash)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.orange.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.warning_amber_rounded, size: 14, color: Colors.orange[700]),
                  const SizedBox(width: 4),
                  Text(
                    'TAHSİLAT',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: Colors.orange[700],
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildNotesCard(String notes) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.amber.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.amber.withOpacity(0.3)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.info_outline, color: Colors.amber[700], size: 22),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Müşteri Notu',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.amber[800],
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  notes,
                  style: TextStyle(
                    color: Colors.amber[900],
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons() {
    final status = widget.delivery.status;
    if (status == 'delivered' || status == 'cancelled') return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Durum bazlı buton
        _buildMainActionButton(status),
        
        if (status == 'in_transit') ...[
          const SizedBox(height: 12),
          OutlinedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.error_outline, color: Colors.red),
            label: const Text(
              'TESLİMAT BAŞARISIZ',
              style: TextStyle(color: Colors.red),
            ),
            style: OutlinedButton.styleFrom(
              foregroundColor: Colors.red,
              padding: const EdgeInsets.symmetric(vertical: 16),
              side: const BorderSide(color: Colors.red),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildMainActionButton(String status) {
    String label;
    IconData icon;
    Color color;
    VoidCallback onPressed;

    switch (status) {
      case 'pending':
        label = 'SİPARİŞİ KABUL ET';
        icon = Icons.check_circle_outline;
        color = const Color(0xFF1E40AF);
        onPressed = () => _updateStatus('assigned');
        break;
      case 'assigned':
        label = 'RESTORANDAN ALINDI';
        icon = Icons.shopping_bag_outlined;
        color = Colors.blue;
        onPressed = () => _updateStatus('picked_up');
        break;
      case 'picked_up':
        label = 'YOLA ÇIKILDI';
        icon = Icons.delivery_dining;
        color = Colors.indigo;
        onPressed = () => _updateStatus('in_transit');
        break;
      case 'in_transit':
        label = 'TESLİM EDİLDİ';
        icon = Icons.check_circle;
        color = Colors.green;
        onPressed = _completeDelivery;
        break;
      default:
        return const SizedBox.shrink();
    }

    return ElevatedButton.icon(
      onPressed: onPressed,
      icon: Icon(icon, size: 24),
      label: Text(
        label,
        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
      ),
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(vertical: 18),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        elevation: 2,
      ),
    );
  }
}
