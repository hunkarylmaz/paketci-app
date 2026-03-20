import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Region } from '../../regions/entities/region.entity';
import { User } from '../../users/entities/user.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { Contract } from '../../contracts/entities/contract.entity';
import { Invoice } from '../../invoices/entities/invoice.entity';

export enum DealerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Entity('dealers')
export class Dealer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  companyName: string;

  @Column({ nullable: true })
  ownerId: string;

  @ManyToOne(() => User, user => user.ownedDealers, { nullable: true })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({ nullable: true })
  regionId: string;

  @ManyToOne(() => Region, region => region.dealers)
  @JoinColumn({ name: 'regionId' })
  region: Region;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  commissionRate: number;

  @Column('simple-json')
  address: {
    full: string;
    district: string;
    city: string;
    postalCode?: string;
  };

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({
    type: 'enum',
    enum: DealerStatus,
    default: DealerStatus.ACTIVE,
  })
  status: DealerStatus;

  @Column({ nullable: true })
  taxNumber: string;

  @Column({ nullable: true })
  bankAccount: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  monthlyTarget: number;

  @OneToMany(() => Restaurant, restaurant => restaurant.dealer)
  restaurants: Restaurant[];

  @OneToMany(() => Contract, contract => contract.dealer)
  contracts: Contract[];

  @OneToMany(() => Invoice, invoice => invoice.dealer)
  invoices: Invoice[];

  @CreateDateColumn()
  createdAt: Date;
}
