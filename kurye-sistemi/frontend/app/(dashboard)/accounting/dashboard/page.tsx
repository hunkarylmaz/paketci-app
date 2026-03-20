"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  FileText,
  MoreHorizontal,
  RefreshCw,
  TrendingUp,
  Wallet,
  XCircle,
  AlertCircle,
  Receipt,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";

// Mock data for revenue chart
const revenueData = [
  { month: "Ocak", income: 45000 },
  { month: "Şubat", income: 52000 },
  { month: "Mart", income: 48000 },
  { month: "Nisan", income: 61000 },
  { month: "Mayıs", income: 55000 },
  { month: "Haziran", income: 67000 },
  { month: "Temmuz", income: 71000 },
  { month: "Ağustos", income: 69000 },
  { month: "Eylül", income: 58000 },
  { month: "Ekim", income: 64000 },
  { month: "Kasım", income: 72000 },
  { month: "Aralık", income: 78000 },
];

// Mock data for invoice status pie chart
const invoiceStatusData = [
  { name: "Ödenmiş", value: 245, color: "#22c55e" },
  { name: "Beklemede", value: 89, color: "#f59e0b" },
  { name: "Gecikmiş", value: 34, color: "#ef4444" },
];

// Mock data for recent transactions
const recentTransactions = [
  {
    id: "INV-2024-001",
    customer: "ABC Lojistik Ltd.",
    amount: 12500,
    date: "2024-12-20",
    status: "paid",
    type: "invoice",
  },
  {
    id: "INV-2024-002",
    customer: "XYZ Kargo A.Ş.",
    amount: 8750,
    date: "2024-12-19",
    status: "pending",
    type: "invoice",
  },
  {
    id: "PAY-2024-045",
    customer: "Hızlı Dağıtım",
    amount: 15000,
    date: "2024-12-18",
    status: "completed",
    type: "payment",
  },
  {
    id: "INV-2024-003",
    customer: "Mega Transfer",
    amount: 23400,
    date: "2024-12-17",
    status: "overdue",
    type: "invoice",
  },
  {
    id: "INV-2024-004",
    customer: "Star Nakliyat",
    amount: 9800,
    date: "2024-12-16",
    status: "paid",
    type: "invoice",
  },
  {
    id: "PAY-2024-046",
    customer: "Express Kurye",
    amount: 5600,
    date: "2024-12-15",
    status: "completed",
    type: "payment",
  },
];

// Mock data for overdue alerts
const overdueAlerts = [
  {
    id: "INV-2024-003",
    customer: "Mega Transfer",
    amount: 23400,
    daysOverdue: 15,
    severity: "high",
  },
  {
    id: "INV-2024-015",
    customer: "Global Lojistik",
    amount: 18750,
    daysOverdue: 8,
    severity: "medium",
  },
  {
    id: "INV-2024-021",
    customer: "Speedy Delivery",
    amount: 9200,
    daysOverdue: 5,
    severity: "low",
  },
  {
    id: "INV-2024-018",
    customer: "Fast Track",
    amount: 15600,
    daysOverdue: 12,
    severity: "high",
  },
];

// Stats data
const statsData = [
  {
    title: "Bekleyen Faturalar",
    value: "89",
    subValue: "₺456,750",
    icon: FileText,
    trend: "+12%",
    trendUp: false,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    title: "Aylık Tahsilat",
    value: "₺125,400",
    subValue: "Bu ay",
    icon: Banknote,
    trend: "+8.5%",
    trendUp: true,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "Gecikmiş Ödemeler",
    value: "34",
    subValue: "₺89,200",
    icon: AlertTriangle,
    trend: "-5%",
    trendUp: true,
    gradient: "from-rose-500 to-red-600",
  },
  {
    title: "Mutabakat Bekleyen",
    value: "12",
    subValue: "₺34,500",
    icon: RefreshCw,
    trend: "+3",
    trendUp: false,
    gradient: "from-blue-500 to-indigo-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getStatusBadge(status: string) {
  const styles: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode; label: string }> = {
    paid: { variant: "default", icon: <CheckCircle2 className="w-3 h-3" />, label: "Ödendi" },
    pending: { variant: "secondary", icon: <Clock className="w-3 h-3" />, label: "Beklemede" },
    overdue: { variant: "destructive", icon: <AlertTriangle className="w-3 h-3" />, label: "Gecikmiş" },
    completed: { variant: "default", icon: <CheckCircle2 className="w-3 h-3" />, label: "Tamamlandı" },
  };

  const style = styles[status] || styles.pending;

  return (
    <Badge variant={style.variant} className="gap-1">
      {style.icon}
      {style.label}
    </Badge>
  );
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
    case "medium":
      return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
    case "low":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export default function AccountingDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Muhasebe Paneli
            </h1>
            <p className="text-muted-foreground mt-1">
              Finansal durumunuzu takip edin ve yönetin
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Download className="w-4 h-4" />
              Rapor İndir
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <TabsList className="grid w-full grid-cols-5 lg:w-fit bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border">
              <TabsTrigger value="overview" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Genel Bakış</span>
              </TabsTrigger>
              <TabsTrigger value="invoices" className="gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Faturalar</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="gap-2">
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Ödemeler</span>
              </TabsTrigger>
              <TabsTrigger value="debts" className="gap-2">
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline">Borçlar</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Raporlar</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <AnimatePresence mode="wait">
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {statsData.map((stat, index) => (
                  <motion.div key={stat.title} variants={itemVariants}>
                    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                      />
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                          </CardTitle>
                          <div
                            className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} text-white`}
                          >
                            <stat.icon className="w-4 h-4" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                              {stat.subValue}
                            </p>
                            <div
                              className={`flex items-center gap-1 text-xs font-medium ${
                                stat.trendUp ? "text-emerald-600" : "text-rose-600"
                              }`}
                            >
                              {stat.trendUp ? (
                                <ArrowUpRight className="w-3 h-3" />
                              ) : (
                                <ArrowDownRight className="w-3 h-3" />
                              )}
                              {stat.trend}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Charts Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Revenue Chart */}
                <Card className="lg:col-span-2 border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          Gelir Grafiği
                        </CardTitle>
                        <CardDescription>
                          Aylık gelir trendi ve karşılaştırma
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          Bu Yıl
                        </Badge>
                        <Badge variant="outline" className="gap-1 text-muted-foreground">
                          <div className="w-2 h-2 rounded-full bg-gray-300" />
                          Geçen Yıl
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                          <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorIncomePrev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                            dataKey="month"
                            stroke="#9ca3af"
                            fontSize={12}
                            tickLine={false}
                          />
                          <YAxis
                            stroke="#9ca3af"
                            fontSize={12}
                            tickLine={false}
                            tickFormatter={(value) => `₺${value / 1000}k`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(255, 255, 255, 0.95)",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                            formatter={(value: number) => formatCurrency(value)}
                          />
                          <Area
                            type="monotone"
                            dataKey="income"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorIncome)"
                            name="Bu Yıl"
                          />
                          <Area
                            type="monotone"
                            dataKey={(data) => data.income * 0.85}
                            stroke="#10b981"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            fillOpacity={1}
                            fill="url(#colorIncomePrev)"
                            name="Geçen Yıl"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Invoice Status Pie Chart */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="w-5 h-5 text-purple-600" />
                      Fatura Durumları
                    </CardTitle>
                    <CardDescription>
                      Ödeme durumuna göre dağılım
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={invoiceStatusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {invoiceStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(255, 255, 255, 0.95)",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                            }}
                            formatter={(value: number, name: string) => [`${value} adet`, name]}
                          />
                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value) => (
                              <span className="text-sm text-muted-foreground">{value}</span>
                            )}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {invoiceStatusData.map((item) => (
                        <div key={item.name} className="text-center">
                          <div
                            className="text-lg font-bold"
                            style={{ color: item.color }}
                          >
                            {item.value}
                          </div>
                          <div className="text-xs text-muted-foreground">{item.name}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Bottom Row: Recent Transactions & Overdue Alerts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Recent Transactions */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Receipt className="w-5 h-5 text-emerald-600" />
                          Son İşlemler
                        </CardTitle>
                        <CardDescription>
                          Son 24 saatteki finansal işlemler
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        Tümünü Gör
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>İşlem</TableHead>
                          <TableHead>Müşteri</TableHead>
                          <TableHead>Tutar</TableHead>
                          <TableHead>Durum</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentTransactions.slice(0, 5).map((transaction) => (
                          <TableRow key={transaction.id} className="group">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`p-1.5 rounded-md ${
                                    transaction.type === "invoice"
                                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                      : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                  }`}
                                >
                                  {transaction.type === "invoice" ? (
                                    <FileText className="w-3.5 h-3.5" />
                                  ) : (
                                    <CreditCard className="w-3.5 h-3.5" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium text-sm">
                                    {transaction.id}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatDate(transaction.date)}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              {transaction.customer}
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(transaction.amount)}
                            </TableCell>
                            <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Overdue Alerts */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                          <AlertCircle className="w-5 h-5" />
                          Gecikme Uyarıları
                        </CardTitle>
                        <CardDescription>
                          Acil müdahale gerektiren ödemeler
                        </CardDescription>
                      </div>
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {overdueAlerts.length} Uyarı
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {overdueAlerts.map((alert, index) => (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 ${getSeverityColor(
                            alert.severity
                          )} hover:shadow-md transition-shadow`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                alert.severity === "high"
                                  ? "bg-red-200 dark:bg-red-800"
                                  : alert.severity === "medium"
                                  ? "bg-amber-200 dark:bg-amber-800"
                                  : "bg-yellow-200 dark:bg-yellow-800"
                              }`}
                            >
                              <AlertTriangle
                                className={`w-4 h-4 ${
                                  alert.severity === "high"
                                    ? "text-red-700 dark:text-red-300"
                                    : alert.severity === "medium"
                                    ? "text-amber-700 dark:text-amber-300"
                                    : "text-yellow-700 dark:text-yellow-300"
                                }`}
                              />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{alert.customer}</div>
                              <div className="text-xs opacity-80">{alert.id}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-sm">
                              {formatCurrency(alert.amount)}
                            </div>
                            <div className="text-xs opacity-80">
                              {alert.daysOverdue} gün gecikmiş
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="invoices" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Fatura Yönetimi</CardTitle>
                        <CardDescription>
                          Tüm faturalarınızı görüntüleyin ve yönetin
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">Filtrele</Button>
                        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                          <FileText className="w-4 h-4 mr-2" />
                          Yeni Fatura
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fatura No</TableHead>
                          <TableHead>Müşteri</TableHead>
                          <TableHead>Tutar</TableHead>
                          <TableHead>Tarih</TableHead>
                          <TableHead>Son Ödeme</TableHead>
                          <TableHead>Durum</TableHead>
                          <TableHead>İşlemler</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentTransactions
                          .filter((t) => t.type === "invoice")
                          .map((invoice) => (
                            <TableRow key={invoice.id}>
                              <TableCell className="font-medium">{invoice.id}</TableCell>
                              <TableCell>{invoice.customer}</TableCell>
                              <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                              <TableCell>{formatDate(invoice.date)}</TableCell>
                              <TableCell>
                                {new Date(
                                  new Date(invoice.date).getTime() + 30 * 24 * 60 * 60 * 1000
                                ).toLocaleDateString("tr-TR")}
                              </TableCell>
                              <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Ödeme İşlemleri</CardTitle>
                        <CardDescription>
                          Tahsilat ve ödeme geçmişi
                        </CardDescription>
                      </div>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Dışa Aktar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {[
                        { label: "Toplam Tahsilat", value: "₺456,780", trend: "+12%" },
                        { label: "Bekleyen Ödeme", value: "₺89,450", trend: "-5%" },
                        { label: "Ortalama Ödeme Süresi", value: "14 gün", trend: "-2 gün" },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border"
                        >
                          <div className="text-sm text-muted-foreground">{stat.label}</div>
                          <div className="text-2xl font-bold mt-1">{stat.value}</div>
                          <div className="text-xs text-emerald-600 mt-1">{stat.trend}</div>
                        </div>
                      ))}
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>İşlem ID</TableHead>
                          <TableHead>Müşteri</TableHead>
                          <TableHead>Tutar</TableHead>
                          <TableHead>Tarih</TableHead>
                          <TableHead>Ödeme Yöntemi</TableHead>
                          <TableHead>Durum</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentTransactions
                          .filter((t) => t.type === "payment")
                          .map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell className="font-medium">{payment.id}</TableCell>
                              <TableCell>{payment.customer}</TableCell>
                              <TableCell>{formatCurrency(payment.amount)}</TableCell>
                              <TableCell>{formatDate(payment.date)}</TableCell>
                              <TableCell>
                                <Badge variant="outline">Havale</Badge>
                              </TableCell>
                              <TableCell>{getStatusBadge(payment.status)}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="debts" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle>Borç Yönetimi</CardTitle>
                    <CardDescription>
                      Müşteri borçları ve tahsilat planı
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {overdueAlerts.map((debt) => (
                        <div
                          key={debt.id}
                          className="flex items-center justify-between p-4 rounded-xl border bg-white dark:bg-gray-900"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
                              <Wallet className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                              <div className="font-medium">{debt.customer}</div>
                              <div className="text-sm text-muted-foreground">
                                {debt.id} • {debt.daysOverdue} gün gecikmiş
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-lg font-bold text-red-600">
                                {formatCurrency(debt.amount)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Toplam Borç
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              Hatırlat
                            </Button>
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                              Tahsil Et
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {[
                  {
                    title: "Aylık Gelir Raporu",
                    description: "Detaylı aylık gelir analizi",
                    icon: BarChart3,
                    color: "blue",
                  },
                  {
                    title: "Müşteri Borç Raporu",
                    description: "Müşteri bazlı borç durumu",
                    icon: Wallet,
                    color: "amber",
                  },
                  {
                    title: "Tahsilat Performansı",
                    description: "Tahsilat ekip performansı",
                    icon: TrendingUp,
                    color: "emerald",
                  },
                  {
                    title: "Vergi Raporu",
                    description: "KDV ve vergi beyannameleri",
                    icon: Receipt,
                    color: "purple",
                  },
                ].map((report) => (
                  <Card
                    key={report.title}
                    className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-xl bg-${report.color}-100 dark:bg-${report.color}-900/30 group-hover:scale-110 transition-transform`}
                        >
                          <report.icon
                            className={`w-6 h-6 text-${report.color}-600 dark:text-${report.color}-400`}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{report.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {report.description}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}
