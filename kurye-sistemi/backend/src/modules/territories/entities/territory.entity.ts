// Territory Entity - Bölge Yönetimi için
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Region } from '../../regions/entities/region.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { Lead } from '../../leads/entities/lead.entity';

export enum TerritoryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum TerritoryPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

@Entity('territories')
export class Territory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  regionId: string;

  @ManyToOne(() => Region, region => region.territories, { nullable: true })
  @JoinColumn({ name: 'regionId' })
  region: Region;

  // Saha satış temsilcisi
  @Column({ nullable: true })
  fieldSalesId: string;

  @ManyToOne(() => User, user => user.assignedTerritories, { nullable: true })
  @JoinColumn({ name: 'fieldSalesId' })
  fieldSales: User;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: TerritoryStatus,
    default: TerritoryStatus.ACTIVE
  })
  status: TerritoryStatus;

  @Column({
    type: 'enum',
    enum: TerritoryPriority,
    default: TerritoryPriority.MEDIUM
  })
  priority: TerritoryPriority;

  // İlişkiler
  @OneToMany(() => Restaurant, restaurant => restaurant.territory)
  restaurants: Restaurant[];

  @OneToMany(() => Lead, lead => lead.territory)
  leads: Lead[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
