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
import { Lead } from '../../leads/entities/lead.entity';

export enum TerritoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum TerritoryPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
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
  regionId: string;

  @ManyToOne(() => Region, region => region.territories)
  @JoinColumn({ name: 'regionId' })
  region: Region;

  @Column({ nullable: true })
  fieldSalesId: string;

  @ManyToOne(() => User, user => user.assignedTerritories, { nullable: true })
  @JoinColumn({ name: 'fieldSalesId' })
  fieldSales: User;

  @Column('simple-json', { nullable: true })
  boundaries: {
    type: 'polygon';
    coordinates: number[][][];
  };

  @Column({
    type: 'enum',
    enum: TerritoryPriority,
    default: TerritoryPriority.MEDIUM,
  })
  priority: TerritoryPriority;

  @Column({
    type: 'enum',
    enum: TerritoryStatus,
    default: TerritoryStatus.ACTIVE,
  })
  status: TerritoryStatus;

  @OneToMany(() => Restaurant, restaurant => restaurant.territory)
  restaurants: Restaurant[];

  @OneToMany(() => Lead, lead => lead.territory)
  leads: Lead[];

  @CreateDateColumn()
  createdAt: Date;
}
