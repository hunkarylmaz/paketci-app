import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as net from 'net';
import * as SerialPort from 'serialport';
import { POSIntegration, CallerIDDevice, Printer } from './entities';

// Standart Sipariş Formatı (POS'tan gelen)
interface POSOrder {
  externalId: string;
  posType: string;
  
  customer?: {
    name: string;
    phone?: string;
    address?: string;
  };
  
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
    options?: string[];
  }[];
  
  payment: {
    method: string;
    total: number;
    tip?: number;
    discount?: number;
  };
  
  tableNumber?: string;
  orderType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  note?: string;
  createdAt: Date;
}

@Injectable()
export class POSIntegrationService {
  private readonly logger = new Logger(POSIntegrationService.name);
  private tcpConnections: Map<string, net.Socket> = new Map();
  private serialConnections: Map<string, SerialPort> = new Map();

  constructor(
    @InjectRepository(POSIntegration)
    private posRepo: Repository<POSIntegration>,
    @InjectRepository(CallerIDDevice)
    private callerIdRepo: Repository<CallerIDDevice>,
    @InjectRepository(Printer)
    private printerRepo: Repository<Printer>,
    private httpService: HttpService,
  ) {}

  // ============================================
  // POS ENTEGRASYON
  // ============================================

  // Adisyo POS entegrasyonu
  async pullAdisyoOrders(integration: POSIntegration): Promise<POSOrder[]> {
    try {
      const { apiKey, endpoint } = integration.connectionConfig;
      
      const response = await firstValueFrom(
        this.httpService.get(`${endpoint}/orders`, {
          headers: { 'X-API-Key': apiKey },
          params: {
            since: integration.lastSyncAt?.toISOString() || new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          },
        }),
      );

      const orders: POSOrder[] = response.data.orders.map((order: any) => ({
        externalId: order.id,
        posType: 'ADISYO',
        customer: order.customer ? {
          name: order.customer.name,
          phone: order.customer.phone,
          address: order.delivery?.address,
        } : undefined,
        items: order.items.map((item: any) => ({
          name: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.totalPrice,
          options: item.extras?.map((e: any) => e.name),
        })),
        payment: {
          method: order.paymentType,
          total: order.totalAmount,
          tip: order.tip,
          discount: order.discount,
        },
        tableNumber: order.table?.number,
        orderType: order.type === 'DELIVERY' ? 'DELIVERY' : order.table ? 'DINE_IN' : 'TAKEAWAY',
        note: order.note,
        createdAt: new Date(order.createdAt),
      }));

      integration.lastSyncAt = new Date();
      await this.posRepo.save(integration);

      return orders;
    } catch (error) {
      this.logger.error(`Adisyo pull error: ${error.message}`);
      throw error;
    }
  }

  // Sepettakip POS entegrasyonu
  async pullSepettakipOrders(integration: POSIntegration): Promise<POSOrder[]> {
    try {
      const { apiKey, apiSecret, endpoint } = integration.connectionConfig;
      
      const timestamp = Date.now().toString();
      const signature = this.generateHMAC(apiKey, apiSecret, timestamp);

      const response = await firstValueFrom(
        this.httpService.get(`${endpoint}/api/v1/orders`, {
          headers: {
            'X-API-Key': apiKey,
            'X-Timestamp': timestamp,
            'X-Signature': signature,
          },
        }),
      );

      return response.data.map((order: any) => this.transformSepettakipOrder(order));
    } catch (error) {
      this.logger.error(`Sepettakip pull error: ${error.message}`);
      throw error;
    }
  }

  // Şefim POS entegrasyonu
  async pullSefimOrders(integration: POSIntegration): Promise<POSOrder[]> {
    try {
      const { ip, port } = integration.connectionConfig;
      
      // TCP bağlantısı kur
      const orders = await this.querySefimTCPServer(ip, port);
      
      return orders.map((order: any) => this.transformSefimOrder(order));
    } catch (error) {
      this.logger.error(`Şefim pull error: ${error.message}`);
      throw error;
    }
  }

  // ============================================
  // CALLER ID ENTEGRASYON
  // ============================================

  async initializeCallerID(device: CallerIDDevice): Promise<void> {
    try {
      if (device.deviceType === 'SERIAL') {
        await this.setupSerialCallerID(device);
      } else if (device.deviceType === 'NETWORK') {
        await this.setupNetworkCallerID(device);
      } else if (device.deviceType === 'SOFTWARE') {
        await this.setupSoftwareCallerID(device);
      }
    } catch (error) {
      this.logger.error(`Caller ID init error: ${error.message}`);
      throw error;
    }
  }

  private async setupSerialCallerID(device: CallerIDDevice): Promise<void> {
    const { port, baudRate = 9600 } = device.connectionConfig;
    
    const serialPort = new SerialPort({
      path: port,
      baudRate,
      autoOpen: false,
    });

    serialPort.on('data', (data: Buffer) => {
      const callerInfo = this.parseCallerIDData(data.toString());
      if (callerInfo) {
        this.handleIncomingCall(device.restaurantId, callerInfo);
      }
    });

    serialPort.on('error', (error) => {
      this.logger.error(`Serial port error: ${error.message}`);
    });

    await new Promise((resolve, reject) => {
      serialPort.open((err) => {
        if (err) reject(err);
        else resolve(null);
      });
    });

    this.serialConnections.set(device.id, serialPort);
    this.logger.log(`Serial Caller ID initialized on ${port}`);
  }

  private async setupNetworkCallerID(device: CallerIDDevice): Promise<void> {
    const { ip, networkPort } = device.connectionConfig;
    
    const client = new net.Socket();
    
    client.connect(networkPort, ip, () => {
      this.logger.log(`Network Caller ID connected to ${ip}:${networkPort}`);
    });

    client.on('data', (data: Buffer) => {
      const callerInfo = this.parseNetworkCallerIDData(data.toString());
      if (callerInfo) {
        this.handleIncomingCall(device.restaurantId, callerInfo);
      }
    });

    client.on('error', (error) => {
      this.logger.error(`Network Caller ID error: ${error.message}`);
    });

    this.tcpConnections.set(device.id, client);
  }

  private async setupSoftwareCallerID(device: CallerIDDevice): Promise<void> {
    // Windows Service veya Android Service üzerinden gelen veri
    // WebSocket üzerinden dinle
    this.logger.log(`Software Caller ID initialized for restaurant ${device.restaurantId}`);
  }

  // WebSocket üzerinden gelen Caller ID verisi
  async handleCallerIDFromService(
    restaurantId: string,
    callerInfo: { number: string; name?: string; line?: string },
  ): Promise<void> {
    this.handleIncomingCall(restaurantId, callerInfo);
  }

  private handleIncomingCall(
    restaurantId: string,
    callerInfo: { number: string; name?: string; line?: string },
  ): void {
    this.logger.log(`Incoming call at restaurant ${restaurantId}: ${callerInfo.number}`);

    // WebSocket üzerinden restorana bildir
    // this.wsServer.to(`restaurant:${restaurantId}`).emit('caller:id', callerInfo);

    // Müşteri bilgilerini veritabanından çek ve gönder
    this.lookupCustomerAndNotify(restaurantId, callerInfo);
  }

  private async lookupCustomerAndNotify(
    restaurantId: string,
    callerInfo: { number: string; name?: string },
  ): Promise<void> {
    // Veritabanından müşteri ara
    // const customer = await this.customerService.findByPhone(callerInfo.number);
    
    // Restorana müşteri bilgilerini gönder
    // this.wsServer.to(`restaurant:${restaurantId}`).emit('customer:popup', {
    //   phone: callerInfo.number,
    //   customer: customer || null,
    // });
  }

  private parseCallerIDData(data: string): { number: string; name?: string } | null {
    // Farklı Caller ID formatlarını parse et
    // Örnek: "N:05321234567"
    const numberMatch = data.match(/N:(\d+)/);
    const nameMatch = data.match(/NAME:(.+)/);
    
    if (numberMatch) {
      return {
        number: numberMatch[1],
        name: nameMatch?.[1]?.trim(),
      };
    }
    return null;
  }

  private parseNetworkCallerIDData(data: string): { number: string; name?: string; line?: string } {
    // Network Caller ID formatı
    const parts = data.split('|');
    return {
      number: parts[0],
      name: parts[1],
      line: parts[2],
    };
  }

  // ============================================
  // YAZICI ENTEGRASYON
  // ============================================

  async printReceipt(printer: Printer, data: ReceiptData): Promise<void> {
    try {
      let buffer: Buffer;

      if (printer.connectionType === 'BLUETOOTH') {
        buffer = this.generateBluetoothReceipt(data, printer);
        // Android/Windows Service'e gönder
        await this.sendToPrinterService(printer.restaurantId, 'bluetooth', {
          macAddress: printer.connectionConfig.macAddress,
          data: buffer.toString('base64'),
        });
      } else if (printer.connectionType === 'WIFI' || printer.connectionType === 'ETHERNET') {
        buffer = this.generateESCPOSReceipt(data, printer);
        await this.printToNetworkPrinter(printer, buffer);
      } else if (printer.connectionType === 'USB') {
        buffer = this.generateESCPOSReceipt(data, printer);
        await this.sendToPrinterService(printer.restaurantId, 'usb', {
          usbPath: printer.connectionConfig.usbPath,
          data: buffer.toString('base64'),
        });
      }
    } catch (error) {
      this.logger.error(`Print error: ${error.message}`);
      throw error;
    }
  }

  private generateBluetoothReceipt(data: ReceiptData, printer: Printer): Buffer {
    // Basit Bluetooth yazıcı formatı
    const width = printer.printConfig.paperWidth;
    let output = '';

    // Header
    output += '================================\n';
    output += `    ${data.restaurantName}\n`;
    output += `    ${data.receiptNumber}\n`;
    output += '================================\n\n';

    // Items
    for (const item of data.items) {
      output += `${item.name}\n`;
      output += `${item.quantity}x ${item.unitPrice} = ${item.total}\n`;
    }

    output += '\n================================\n';
    output += `TOPLAM: ${data.total}\n`;
    output += '================================\n';

    if (printer.printConfig.cutPaper) {
      output += '\x1D\x56\x00'; // ESC/POS cut command
    }

    return Buffer.from(output, 'utf-8');
  }

  private generateESCPOSReceipt(data: ReceiptData, printer: Printer): Buffer {
    // ESC/POS komutları ile detaylı fiş
    const commands: number[] = [];

    // Initialize printer
    commands.push(0x1B, 0x40);

    // Center alignment
    commands.push(0x1B, 0x61, 0x01);

    // Bold on
    commands.push(0x1B, 0x45, 0x01);
    commands.push(...Buffer.from(data.restaurantName));
    commands.push(0x0A);

    // Bold off
    commands.push(0x1B, 0x45, 0x00);
    commands.push(...Buffer.from(data.receiptNumber));
    commands.push(0x0A);
    commands.push(...Buffer.from('--------------------------------'));
    commands.push(0x0A);

    // Left alignment
    commands.push(0x1B, 0x61, 0x00);

    // Items
    for (const item of data.items) {
      commands.push(...Buffer.from(`${item.name}\n`));
      commands.push(...Buffer.from(`${item.quantity}x ${item.unitPrice} = ${item.total}\n`));
    }

    commands.push(...Buffer.from('--------------------------------\n'));
    
    // Bold for total
    commands.push(0x1B, 0x45, 0x01);
    commands.push(...Buffer.from(`TOPLAM: ${data.total}\n`));
    commands.push(0x1B, 0x45, 0x00);

    // Cut paper
    if (printer.printConfig.cutPaper) {
      commands.push(0x1D, 0x56, 0x00);
    }

    return Buffer.from(commands);
  }

  private async printToNetworkPrinter(printer: Printer, buffer: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      const client = new net.Socket();
      
      client.connect(printer.connectionConfig.port, printer.connectionConfig.ip, () => {
        client.write(buffer);
        client.end();
        resolve();
      });

      client.on('error', (err) => {
        reject(err);
      });
    });
  }

  private async sendToPrinterService(
    restaurantId: string,
    type: 'bluetooth' | 'usb',
    data: any,
  ): Promise<void> {
    // WebSocket üzerinden Windows/Android servisine gönder
    // this.wsServer.to(`restaurant:${restaurantId}:printer`).emit('print', { type, data });
  }

  private async querySefimTCPServer(ip: string, port: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const client = new net.Socket();
      const orders: any[] = [];

      client.connect(port, ip, () => {
        // Şefim protokolü ile sipariş isteği gönder
        client.write(Buffer.from([0x02, 0x31, 0x03])); // STX + '1' + ETX
      });

      client.on('data', (data) => {
        // Şefim yanıtını parse et
        const response = this.parseSefimResponse(data);
        orders.push(...response);
        client.end();
      });

      client.on('close', () => {
        resolve(orders);
      });

      client.on('error', (err) => {
        reject(err);
      });

      // 10 saniye timeout
      setTimeout(() => {
        client.destroy();
        reject(new Error('TCP timeout'));
      }, 10000);
    });
  }

  private parseSefimResponse(data: Buffer): any[] {
    // Şefim binary protokolünü parse et
    // Implementation...
    return [];
  }

  private transformSepettakipOrder(order: any): POSOrder {
    return {
      externalId: order.orderId,
      posType: 'SEPETTAKIP',
      customer: {
        name: order.customerName,
        phone: order.customerPhone,
        address: order.deliveryAddress,
      },
      items: order.products.map((p: any) => ({
        name: p.name,
        quantity: p.quantity,
        unitPrice: p.price,
        total: p.total,
        options: p.options,
      })),
      payment: {
        method: order.paymentMethod,
        total: order.total,
        tip: order.tip,
        discount: order.discountAmount,
      },
      orderType: order.isDelivery ? 'DELIVERY' : 'DINE_IN',
      note: order.notes,
      createdAt: new Date(order.orderDate),
    };
  }

  private transformSefimOrder(order: any): POSOrder {
    return {
      externalId: order.fisNo,
      posType: 'SEFIM',
      customer: order.musteri ? {
        name: order.musteri.adi,
        phone: order.musteri.telefon,
        address: order.musteri.adres,
      } : undefined,
      items: order.kalemler.map((k: any) => ({
        name: k.urunAdi,
        quantity: k.miktar,
        unitPrice: k.birimFiyat,
        total: k.toplam,
        options: k.secenekler,
      })),
      payment: {
        method: order.odemeTipi,
        total: order.toplamTutar,
        tip: order.bahsis,
      },
      tableNumber: order.masaNo,
      orderType: order.siparisTipi,
      note: order.aciklama,
      createdAt: new Date(order.tarih),
    };
  }

  private generateHMAC(apiKey: string, apiSecret: string, timestamp: string): string {
    const crypto = require('crypto');
    return crypto
      .createHmac('sha256', apiSecret)
      .update(`${apiKey}:${timestamp}`)
      .digest('hex');
  }
}

// Fiş veri yapısı
interface ReceiptData {
  restaurantName: string;
  receiptNumber: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    unitPrice: string;
    total: string;
  }[];
  total: string;
  paymentMethod: string;
  customerName?: string;
  customerPhone?: string;
  address?: string;
  note?: string;
}
