import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PrinterType {
  THERMAL = 'THERMAL',
  LABEL = 'LABEL',
  IMPACT = 'IMPACT',
  MOBILE = 'MOBILE',
}

export enum PrinterConnectionType {
  BLUETOOTH = 'BLUETOOTH',
  USB = 'USB',
  WIFI = 'WIFI',
  ETHERNET = 'ETHERNET',
  SERIAL = 'SERIAL',
}

@Entity('printers')
export class Printer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  restaurantId: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: PrinterType })
  printerType: PrinterType;

  @Column({ type: 'enum', enum: PrinterConnectionType })
  connectionType: PrinterConnectionType;

  @Column({ type: 'jsonb' })
  connectionConfig: {
    macAddress?: string;
    ip?: string;
    port?: number;
    usbPath?: string;
    comPort?: string;
  };

  @Column({ type: 'jsonb' })
  printConfig: {
    paperWidth: 58 | 80;
    charset: string;
    cutPaper: boolean;
    openCashDrawer: boolean;
  };

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
