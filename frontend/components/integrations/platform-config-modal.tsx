"use client";

import { useState } from "react";
import { 
  X, Eye, EyeOff, Key, Building2, Link2, Save, CheckCircle2,
  AlertCircle, ExternalLink, Copy, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PlatformConfigModalProps {
  platform: {
    id: string;
    name: string;
    icon: string;
    color: string;
    description: string;
    commission: string;
  };
  restaurantId: string;
  onClose: () => void;
  onSave: (config: any) => void;
}

export default function PlatformConfigModal({ 
  platform, 
  restaurantId, 
  onClose, 
  onSave 
}: PlatformConfigModalProps) {
  const [showSecret, setShowSecret] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean; message: string} | null>(null);
  const [config, setConfig] = useState({
    apiKey: "",
    apiSecret: "",
    merchantId: "",
    branchId: "",
    webhookUrl: `https://api.paketci.app/webhooks/${platform.id}`,
  });

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    // Simulate API test
    setTimeout(() => {
      if (config.apiKey && config.apiSecret) {
        setTestResult({ success: true, message: "Bağlantı başarılı! API erişimi doğrulandı." });
      } else {
        setTestResult({ success: false, message: "API bilgileri eksik. Lütfen tüm alanları doldurun." });
      }
      setIsTesting(false);
    }, 1500);
  };

  const handleSave = () => {
    onSave({
      platformId: platform.id,
      restaurantId,
      ...config,
    });
    onClose();
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(config.webhookUrl);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`${platform.color} text-white p-6 rounded-t-2xl`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{platform.icon}</span>
              <div>
                <h2 className="text-xl font-bold">{platform.name} Bağlantısı</h2>
                <p className="text-white/80 text-sm">{platform.description}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-white" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Commission Info */}
          <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Komisyon Oranı</p>
              <p className="font-semibold text-slate-900">{platform.commission}</p>
            </div>
            <a 
              href="#" 
              className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
              target="_blank"
            >
              Partner Portal
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* API Credentials */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">API Bilgileri</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700">API Key</label>
                <div className="relative mt-1">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={config.apiKey}
                    onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                    placeholder="API Key girin"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">API Secret</label>
                <div className="relative mt-1">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showSecret ? "text" : "password"}
                    value={config.apiSecret}
                    onChange={(e) => setConfig({ ...config, apiSecret: e.target.value })}
                    placeholder="API Secret girin"
                    className="w-full pl-10 pr-12 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">Merchant ID</label>
                  <div className="relative mt-1">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={config.merchantId}
                      onChange={(e) => setConfig({ ...config, merchantId: e.target.value })}
                      placeholder="Merchant ID"
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Branch ID</label>
                  <input
                    type="text"
                    value={config.branchId}
                    onChange={(e) => setConfig({ ...config, branchId: e.target.value })}
                    placeholder="Branch ID"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Webhook URL */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900">Webhook URL</h3>
            <p className="text-sm text-slate-500">Bu URL'i {platform.name} partner panelinde webhook olarak tanımlayın.</p>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={config.webhookUrl}
                readOnly
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
              />
              <Button variant="outline" onClick={copyWebhookUrl}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className={`p-4 rounded-xl ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-start gap-2">
                {testResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                )}
                <p className={testResult.success ? 'text-green-800' : 'text-red-800'}>{testResult.message}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
            >
              İptal
            </Button>
            
            <Button 
              variant="outline"
              className="flex-1"
              onClick={handleTestConnection}
              disabled={isTesting}
            >
              {isTesting ? (
                <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Test Ediliyor...</>
              ) : (
                <><Link2 className="w-4 h-4 mr-2" />Test Et</>
              )}
            </Button>
            
            <Button 
              className="flex-1 bg-blue-600"
              onClick={handleSave}
              disabled={!testResult?.success}
            >
              <Save className="w-4 h-4 mr-2" />
              Kaydet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
