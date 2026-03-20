"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const receipt_entity_1 = require("./entities/receipt.entity");
const company_entity_1 = require("../companies/entities/company.entity");
const delivery_entity_1 = require("../deliveries/entities/delivery.entity");
let ReceiptsService = class ReceiptsService {
    constructor(receiptRepository, companyRepository, deliveryRepository) {
        this.receiptRepository = receiptRepository;
        this.companyRepository = companyRepository;
        this.deliveryRepository = deliveryRepository;
    }
    generateReceiptNumber() {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `PKT-${year}${month}${day}-${random}`;
    }
    async create(deliveryId, companyId, customSettings) {
        const delivery = await this.deliveryRepository.findOne({
            where: { id: deliveryId },
            relations: ['company', 'restaurant'],
        });
        if (!delivery) {
            throw new Error('Teslimat bulunamadı');
        }
        const company = await this.companyRepository.findOne({
            where: { id: companyId },
        });
        const channelLabels = {
            web: 'Web Sipariş',
            mobile: 'Mobil Uygulama',
            phone: 'Telefon',
            getir: 'Getir',
            yemeksepeti: 'Yemeksepeti',
            trendyol: 'Trendyol Yemek',
            migros: 'Migros Yemek',
        };
        const paymentLabels = {
            cash: 'Nakit',
            credit_card: 'Kredi Kartı',
            debit_card: 'Banka Kartı',
            meal_card: 'Yemek Kartı',
            online: 'Online Ödeme',
        };
        const items = [
            {
                id: '1',
                name: 'Lahmacun',
                quantity: 2,
                unitPrice: 45.00,
                totalPrice: 90.00,
                category: 'Ana Yemek',
            },
            {
                id: '2',
                name: 'Ayran',
                quantity: 2,
                unitPrice: 15.00,
                totalPrice: 30.00,
                category: 'İçecek',
            },
        ];
        const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
        const deliveryFee = company?.deliveryFeePerOrder || 2.5;
        const total = subtotal + deliveryFee;
        const receipt = this.receiptRepository.create({
            receiptNumber: this.generateReceiptNumber(),
            companyId,
            deliveryId,
            dealerName: company?.name || 'Paketçi',
            dealerLogo: company?.logo || null,
            dealerAddress: company?.address || 'Bodrum, Muğla',
            dealerPhone: company?.phone || '444 0 444',
            dealerTaxNumber: company?.taxNumber || '1234567890',
            customerName: delivery.customerName,
            customerPhone: delivery.customerPhone,
            deliveryAddress: delivery.deliveryAddress,
            items,
            subtotal,
            deliveryFee,
            discount: 0,
            total,
            paymentType: delivery.paymentType || 'cash',
            paymentTypeLabel: paymentLabels[delivery.paymentType] || 'Nakit',
            orderChannel: delivery.orderSource || 'web',
            orderChannelLabel: channelLabels[delivery.orderSource] || 'Web Sipariş',
            template: receipt_entity_1.ReceiptTemplate.STANDARD,
            customSettings: customSettings || {
                showLogo: true,
                showDealerInfo: true,
                showCustomerInfo: true,
                showOrderChannel: true,
                showPaymentType: true,
                showTaxInfo: true,
                showBarcode: true,
                footerText: 'Afiyet Olsun!',
                headerText: '',
                primaryColor: '#1E40AF',
                fontSize: 'medium',
                paperWidth: 80,
            },
        });
        return this.receiptRepository.save(receipt);
    }
    async findAll(companyId) {
        return this.receiptRepository.find({
            where: { companyId },
            order: { createdAt: 'DESC' },
            relations: ['delivery'],
        });
    }
    async findOne(id, companyId) {
        return this.receiptRepository.findOne({
            where: { id, companyId },
            relations: ['delivery', 'company'],
        });
    }
    async updateTemplate(id, companyId, template, customSettings) {
        await this.receiptRepository.update({ id, companyId }, { template, customSettings });
        return this.findOne(id, companyId);
    }
    async markAsPrinted(id, companyId) {
        await this.receiptRepository.update({ id, companyId }, { printedAt: new Date() });
    }
    async generateHtml(id, companyId) {
        const receipt = await this.findOne(id, companyId);
        if (!receipt) {
            throw new Error('Fiş bulunamadı');
        }
        const settings = receipt.customSettings || {};
        const primaryColor = settings.primaryColor || '#1E40AF';
        const fontSize = settings.fontSize === 'small' ? '12px' : settings.fontSize === 'large' ? '16px' : '14px';
        const paperWidth = settings.paperWidth === 58 ? '58mm' : '80mm';
        let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page { size: ${paperWidth} auto; margin: 0; }
        body { 
          font-family: 'Courier New', monospace; 
          font-size: ${fontSize};
          width: ${paperWidth};
          margin: 0 auto;
          padding: 10px;
          background: white;
        }
        .header { text-align: center; margin-bottom: 10px; }
        .logo { max-width: 60px; max-height: 60px; margin-bottom: 5px; }
        .dealer-name { font-size: 1.2em; font-weight: bold; }
        .divider { border-top: 1px dashed #000; margin: 8px 0; }
        .item-row { display: flex; justify-content: space-between; margin: 4px 0; }
        .item-name { flex: 1; }
        .item-qty { width: 30px; text-align: center; }
        .item-price { width: 60px; text-align: right; }
        .total-row { font-weight: bold; font-size: 1.1em; }
        .label { color: #666; font-size: 0.9em; }
        .value { font-weight: 600; }
        .footer { text-align: center; margin-top: 15px; font-size: 0.9em; }
        .barcode { text-align: center; margin: 10px 0; font-family: monospace; }
        .channel-badge { 
          display: inline-block; 
          background: ${primaryColor}; 
          color: white; 
          padding: 2px 8px; 
          border-radius: 4px; 
          font-size: 0.85em;
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
  `;
        html += `<div class="header">`;
        if (settings.showLogo && receipt.dealerLogo) {
            html += `<img src="${receipt.dealerLogo}" class="logo" alt="Logo"/>`;
        }
        else {
            html += `<div style="font-size: 2em; color: ${primaryColor}; font-weight: bold;">P</div>`;
        }
        html += `<div class="dealer-name">${receipt.dealerName}</div>`;
        if (settings.showDealerInfo) {
            html += `<div>${receipt.dealerAddress || ''}</div>`;
            html += `<div>Tel: ${receipt.dealerPhone || ''}</div>`;
            if (receipt.dealerTaxNumber) {
                html += `<div>V.D.: ${receipt.dealerTaxNumber}</div>`;
            }
        }
        html += `</div>`;
        html += `<div class="divider"></div>`;
        if (settings.showOrderChannel) {
            html += `<div style="text-align: center;">`;
            html += `<span class="channel-badge">${receipt.orderChannelLabel}</span>`;
            html += `</div>`;
        }
        html += `<div><span class="label">Fiş No:</span> <span class="value">${receipt.receiptNumber}</span></div>`;
        html += `<div><span class="label">Tarih:</span> ${receipt.createdAt.toLocaleString('tr-TR')}</div>`;
        html += `<div class="divider"></div>`;
        if (settings.showCustomerInfo) {
            html += `<div><strong>MÜŞTERİ</strong></div>`;
            html += `<div>${receipt.customerName}</div>`;
            if (receipt.customerPhone) {
                html += `<div>Tel: ${receipt.customerPhone}</div>`;
            }
            html += `<div>Adres: ${receipt.deliveryAddress}</div>`;
            html += `<div class="divider"></div>`;
        }
        html += `<div><strong>ÜRÜNLER</strong></div>`;
        receipt.items.forEach(item => {
            html += `
        <div class="item-row">
          <span class="item-name">${item.name}</span>
          <span class="item-qty">x${item.quantity}</span>
          <span class="item-price">${item.totalPrice.toFixed(2)}</span>
        </div>
      `;
        });
        html += `<div class="divider"></div>`;
        html += `<div class="item-row"><span>Ara Toplam</span><span>${receipt.subtotal.toFixed(2)} TL</span></div>`;
        html += `<div class="item-row"><span>Teslimat Ücreti</span><span>${receipt.deliveryFee.toFixed(2)} TL</span></div>`;
        if (receipt.discount > 0) {
            html += `<div class="item-row"><span>İndirim</span><span>-${receipt.discount.toFixed(2)} TL</span></div>`;
        }
        html += `<div class="divider"></div>`;
        html += `<div class="item-row total-row"><span>TOPLAM</span><span>${receipt.total.toFixed(2)} TL</span></div>`;
        if (settings.showPaymentType) {
            html += `<div class="divider"></div>`;
            html += `<div style="text-align: center; font-size: 1.1em;">`;
            html += `<span class="label">Ödeme:</span> <span class="value">${receipt.paymentTypeLabel}</span>`;
            html += `</div>`;
        }
        if (settings.showBarcode) {
            html += `<div class="barcode">`;
            html += `*${receipt.receiptNumber}*`;
            html += `</div>`;
        }
        html += `<div class="footer">`;
        if (settings.headerText) {
            html += `<div>${settings.headerText}</div>`;
        }
        html += `<div>${settings.footerText || 'Afiyet Olsun!'}</div>`;
        html += `<div style="margin-top: 5px; font-size: 0.8em;">Paketçi - powered by Paketçiniz</div>`;
        html += `</div>`;
        html += `</body></html>`;
        return html;
    }
};
exports.ReceiptsService = ReceiptsService;
exports.ReceiptsService = ReceiptsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(receipt_entity_1.Receipt)),
    __param(1, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __param(2, (0, typeorm_1.InjectRepository)(delivery_entity_1.Delivery)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReceiptsService);
//# sourceMappingURL=receipts.service.js.map