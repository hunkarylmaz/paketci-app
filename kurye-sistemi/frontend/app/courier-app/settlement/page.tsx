"use client";

import { useState } from "react";
import { 
  ArrowLeft, Calculator, CheckCircle2, XCircle, Clock, 
  DollarSign, Banknote, CreditCard, Wallet, Edit2, Save,
  AlertCircle, FileText, Download, ChevronRight, History,
  TrendingUp, TrendingDown, Search, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data - Gerçek uygulamada API'den gelecek
const settlementData = {
  date: "18 Mart 2026",
  totalDeliveries: 15,
  totalAmount: 425.50,
  cashAmount: 285.00,
  cardAmount: 140.50,
  status: "pending", // pending, confirmed, approved
  canEditPayment: true, // Yetki kontrolü
};

const deliveries = [
  {
    id: "KRY-240318-001",
    customer: "Ali Veli",
    restaurant: "Burger King",
    amount: 185.00,
    paymentType: "Nakit",
    originalPaymentType: "Nakit",
    status: "delivered",
    time: "12:30",
    isEdited: false,
  },
  {
    id: "KRY-240318-002",
    customer: "Ayşe Yılmaz",
    restaurant: "McDonald's",
    amount: 95.50,
    paymentType: "Kredi Kartı",
    originalPaymentType: "Nakit", // Düzenlenmiş
    status: "delivered",
    time: "13:15",
    isEdited: true,
    editedBy: "Kurye",
    editReason: "Müşteri kart ile ödemek istedi",
  },
  {
    id: "KRY-240318-003",
    customer: "Mehmet Kaya",
    restaurant: "Pizza Hut",
    amount: 145.00,
    paymentType: "Nakit",
    originalPaymentType: "Nakit",
    status: "delivered",
    time: "14:00",
    isEdited: false,
  },
];

const historyData = [
  { date: "17 Mart 2026", deliveries: 12, cash: 220.00, card: 85.00, status: "approved" },
  { date: "16 Mart 2026", deliveries: 18, cash: 340.00, card: 120.00, status: "approved" },
  { date: "15 Mart 2026", deliveries: 14, cash: 195.00, card: 150.00, status: "approved" },
];

const paymentTypes = [
  { value: "Nakit", label: "Nakit", icon: Banknote, color: "bg-green-100 text-green-700" },
  { value: "Kredi Kartı", label: "Kredi Kartı", icon: CreditCard, color: "bg-blue-100 text-blue-700" },
  { value: "Havale", label: "Havale/EFT", icon: Wallet, color: "bg-purple-100 text-purple-700" },
];

export default function CourierSettlementPage() {
  const [activeTab, setActiveTab] = useState("today");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedPayments, setEditedPayments] = useState<Record<string, string>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleEditPayment = (deliveryId: string, newType: string) => {
    setEditedPayments({ ...editedPayments, [deliveryId]: newType });
  };

  const savePaymentEdit = (deliveryId: string) => {
    // API çağrısı yapılacak
    setEditingId(null);
  };

  const calculateTotals = () => {
    let cash = 0;
    let card = 0;
    
    deliveries.forEach((d) => {
      const paymentType = editedPayments[d.id] || d.paymentType;
      if (paymentType === "Nakit") {
        cash += d.amount;
      } else {
        card += d.amount;
      }
    });
    
    return { cash, card, total: cash + card };
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Gün Sonu Mutabakat</h1>
            <p className="text-sm text-blue-100">{settlementData.date}</p>
          </div>
          <Badge className="bg-white/20 text-white border-0">
            {settlementData.canEditPayment ? "Düzenleme Açık" : "Düzenleme Kapalı"}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 bg-white rounded-none">
          <TabsTrigger value="today" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
            Bugün
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
            Geçmiş
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="p-4 space-y-4">
          {/* Summary Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Gün Özeti</p>
                  <p className="text-sm text-slate-500">{deliveries.length} teslimat</p>
                </div>
              </div>
              <Badge className="bg-yellow-100 text-yellow-700">
                <Clock className="w-3 h-3 mr-1" />
                Bekliyor
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
              <div className="text-center">
                <p className="text-xs text-slate-500">Toplam</p>
                <p className="text-xl font-bold text-slate-900">{totals.total.toFixed(2)}₺</p>
              </div>
              <div className="text-center border-x border-slate-100">
                <p className="text-xs text-slate-500">Nakit</p>
                <p className="text-xl font-bold text-green-600">{totals.cash.toFixed(2)}₺</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500">Kart</p>
                <p className="text-xl font-bold text-blue-600">{totals.card.toFixed(2)}₺</p>
              </div>
            </div>
          </div>

          {/* Warning if editing is not allowed */}
          {!settlementData.canEditPayment && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Ödeme Düzenleme Kapalı</p>
                  <p className="text-sm text-amber-700">Ödeme tipi değişiklikleri için yönetici onayı gerekiyor.</p>
                </div>
              </div>
            </div>
          )}

          {/* Deliveries List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900">Teslimat Detayları</h3>
              <Button variant="ghost" size="sm" className="text-blue-600">
                <Filter className="w-4 h-4 mr-1" />
                Filtrele
              </Button>
            </div>

            <div className="space-y-3">
              {deliveries.map((delivery) => {
                const currentPaymentType = editedPayments[delivery.id] || delivery.paymentType;
                const paymentTypeInfo = paymentTypes.find(p => p.value === currentPaymentType);
                const PaymentIcon = paymentTypeInfo?.icon || Banknote;
                const isEditing = editingId === delivery.id;
                
                return (
                  <div 
                    key={delivery.id} 
                    className={`bg-white rounded-xl p-4 shadow-sm border ${
                      delivery.isEdited ? 'border-blue-300 bg-blue-50/30' : 'border-slate-200'
                    }`}
003e
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900">{delivery.customer}</p>
                          {delivery.isEdited && (
                            <Badge className="bg-blue-100 text-blue-700 text-xs">
                              Düzenlendi
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">{delivery.restaurant}</p>
                        <p className="text-xs text-slate-400 mt-1">{delivery.id} • {delivery.time}</p>
                        
                        {delivery.isEdited && delivery.editReason && (
                          <p className="text-xs text-blue-600 mt-2 bg-blue-50 p-2 rounded">
                            📝 {delivery.editReason}
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-slate-900">{delivery.amount.toFixed(2)}₺</p>
                        
                        {isEditing ? (
                          <div className="mt-2 space-y-1">
                            {paymentTypes.map((type) => (
                              <button
                                key={type.value}
                                onClick={() => handleEditPayment(delivery.id, type.value)}
                                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm ${
                                  currentPaymentType === type.value
                                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <type.icon className="w-4 h-4" />
                                {type.label}
                              </button>
                            ))}
                            <div className="flex gap-2 mt-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => setEditingId(null)}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-blue-600"
                                onClick={() => savePaymentEdit(delivery.id)}
                              >
                                <Save className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={paymentTypeInfo?.color || "bg-slate-100"}>
                              <PaymentIcon className="w-3 h-3 mr-1" />
                              {currentPaymentType}
                            </Badge>
                            
                            {settlementData.canEditPayment && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="w-6 h-6"
                                onClick={() => setEditingId(delivery.id)}
                              >
                                <Edit2 className="w-3 h-3 text-slate-400" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Confirm Button */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 max-w-md mx-auto">
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 h-12"
                onClick={() => window.location.href = '/courier-app'}
              >
                Vazgeç
              </Button>
              <Button 
                className="flex-1 h-12 bg-blue-600"
                onClick={() => setShowConfirmModal(true)}
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Mutabakat Yap
              </Button>
            </div>
          </div>

          <div className="h-20" />
        </TabsContent>

        <TabsContent value="history" className="p-4 space-y-4">
          <div className="space-y-3">
            {historyData.map((day, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-slate-400" />
                    <p className="font-medium text-slate-900">{day.date}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Onaylandı
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-xs text-slate-500">Teslimat</p>
                    <p className="font-semibold text-slate-900">{day.deliveries}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2">
                    <p className="text-xs text-slate-500">Nakit</p>
                    <p className="font-semibold text-green-600">{day.cash}₺</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2">
                    <p className="text-xs text-slate-500">Kart</p>
                    <p className="font-semibold text-blue-600">{day.card}₺</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  <p className="text-sm text-slate-500">Toplam</p>
                  <p className="font-bold text-slate-900">{(day.cash + day.card).toFixed(2)}₺</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-blue-600" />
              </div>
              
              <h2 className="text-xl font-bold text-slate-900 mb-2">Mutabakat Onayı</h2>
              <p className="text-slate-500 mb-6">
                Gün sonu mutabakatınızı onaylıyor musunuz? Bu işlem geri alınamaz.
              </p>

              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-600">Toplam Teslimat</span>
                  <span className="font-semibold">{deliveries.length}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-600">Nakit Toplam</span>
                  <span className="font-semibold text-green-600">{totals.cash.toFixed(2)}₺</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="font-medium">Genel Toplam</span>
                  <span className="font-bold text-lg">{totals.total.toFixed(2)}₺</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowConfirmModal(false)}
                >
                  İptal
                </Button>
                <Button 
                  className="flex-1 bg-blue-600"
                  onClick={() => {
                    setShowConfirmModal(false);
                    // API call to confirm settlement
                    alert("Mutabakat başarıyla tamamlandı!");
                  }}
                >
                  Onayla
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
