import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Delivery } from '../../deliveries/entities/delivery.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { Courier } from '../../couriers/entities/courier.entity';
import { Shift } from '../../shifts/entities/shift.entity';
import { Credit } from '../../credits/entities/credit.entity';
import { Receipt } from '../../receipts/entities/receipt.entity';

import { User } from '../../users/entities/user.entity';
import { CompanyStatus } from '../enums/company-status.enum';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true, type: 'text' })
  address: string;

  @Column({ nullable: true })
  taxNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  creditBalance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 2.5 })
  deliveryFeePerOrder: number;

  @OneToMany(() => Restaurant, restaurant => restaurant.company)
  restaurants: Restaurant[];

  @OneToMany(() => Courier, courier => courier.company)
  couriers: Courier[];

  @OneToMany(() => Delivery, delivery => delivery.company)
  deliveries: Delivery[];

  @OneToMany(() => Shift, shift => shift.company)
  shifts: Shift[];

  @OneToMany(() => Credit, credit => credit.company)
  credits: Credit[];

  @OneToMany(() => User, user => user.company)
  users: User[];

  @OneToMany(() => Receipt, receipt => receipt.company)
  receipts: Receipt[];

  @Column({ nullable: true, unique: true })
  code: string;

  @Column({ type: 'enum', enum: CompanyStatus, default: CompanyStatus.ACTIVE })
  status: CompanyStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
