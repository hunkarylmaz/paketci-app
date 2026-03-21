import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum CallerIDDeviceType {
  USB = 'USB',
  SERIAL = 'SERIAL',
  NETWORK = 'NETWORK',
  SOFTWARE = 'SOFTWARE',
}

@Entity('caller_id_devices')
export class CallerIDDevice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  restaurantId: string;

  @Column({ type: 'enum', enum: CallerIDDeviceType })
  deviceType: CallerIDDeviceType;

  @Column({ type: 'jsonb' })
  connectionConfig: {
    port?: string;
    baudRate?: number;
    ip?: string;
    networkPort?: number;
    driver?: string;
  };

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
