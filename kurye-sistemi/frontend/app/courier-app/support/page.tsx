"use client";

import { useState } from "react";
import { 
  ArrowLeft, Send, Phone, Clock, CheckCircle2, 
  AlertCircle, MessageSquare, User, Bot, Paperclip,
  Image as ImageIcon, Mic
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const chatHistory = [
  {
    id: 1,
    type: "support",
    sender: "Canlı Destek",
    message: "Merhaba! Size nasıl yardımcı olabilirim?",
    time: "14:30",
    avatar: "👨‍💼",
  },
  {
    id: 2,
    type: "user",
    sender: "Siz",
    message: "Sipariş KRY-240317-001 için müşteri telefonu kapalı. Ne yapmalıyım?",
    time: "14:31",
  },
  {
    id: 3,
    type: "support",
    sender: "Canlı Destek",
    message: "Anladım. Lütfen 5 dakika bekleyin, ardından destek ekibimize bildirin. Kapıya not bırakabilirsiniz.",
    time: "14:32",
    avatar: "👨‍💼",
  },
  {
    id: 4,
    type: "system",
    message: "Destek talebiniz #12345 olarak kaydedildi.",
    time: "14:32",
  },
];

const quickIssues = [
  { icon: Phone, label: "Müşteri Ulaşılamıyor", category: "customer" },
  { icon: AlertCircle, label: "Yanlış Adres", category: "address" },
  { icon: Clock, label: "Gecikme Bildir", category: "delay" },
  { icon: CheckCircle2, label: "Teslimat Sorunu", category: "delivery" },
];

export default function CourierSupportPage() {
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Yardım & Destek</h1>
            <p className="text-sm text-blue-100">Ortalama yanıt süresi: 2 dk</p>
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Quick Issues */}
      <div className="bg-white p-4 border-b border-slate-200">
        <p className="text-sm font-medium text-slate-700 mb-3">Hızlı Bildirim</p>
        <div className="grid grid-cols-2 gap-2">
          {quickIssues.map((issue) => (
            <button
              key={issue.category}
              className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-left hover:bg-blue-50 transition-colors"
            >
              <issue.icon className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-slate-700">{issue.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-2 bg-white rounded-none">
          <TabsTrigger value="chat" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
            Canlı Destek
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
            Geçmiş Talepler
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col m-0">
          {/* Chat Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <div className="text-center">
              <Badge variant="secondary" className="text-xs">Bugün 14:30</Badge>
            </div>

            {chatHistory.map((msg) => (
              <div key={msg.id} className={`flex ${
                msg.type === 'user' ? 'justify-end' : 'justify-start'
              }`}>
                <div className={`flex gap-2 max-w-[80%] ${
                  msg.type === 'user' ? 'flex-row-reverse' : ''
                }`}
003e
                  {msg.avatar && (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">
                      {msg.avatar}
                    </div>
                  )}
                  
                  <div className={`rounded-2xl p-3 ${
                    msg.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : msg.type === 'system'
                      ? 'bg-yellow-50 border border-yellow-200'
                      : 'bg-white border border-slate-200'
                  }`}
003e
                    {msg.type !== 'user' && msg.type !== 'system' && (
                      <p className="text-xs text-slate-500 mb-1">{msg.sender}</p>
                    )}
                    <p className={msg.type === 'system' ? 'text-yellow-800 text-sm' : 'text-sm'}>
                      {msg.message}
                    </p>
                    <p className={`text-xs mt-1 ${
                      msg.type === 'user' ? 'text-blue-100' : 'text-slate-400'
                    }`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-200">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-slate-400">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400">
                <ImageIcon className="w-5 h-5" />
              </Button>
              <input
                type="text"
                placeholder="Mesaj yazın..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button variant="ghost" size="icon" className="text-slate-400">
                <Mic className="w-5 h-5" />
              </Button>
              <Button size="icon" className="bg-blue-600 rounded-full">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="m-0 p-4">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Destek Talebi #{1240 + i}</p>
                      <p className="text-sm text-slate-500">Müşteri ulaşılamıyor</p>
                      <p className="text-xs text-slate-400 mt-1">{i} gün önce • Çözüldü ✅</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
