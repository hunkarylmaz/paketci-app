import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Dealer } from '../../dealers/entities/dealer.entity';
import { Territory } from '../../territories/entities/territory.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';

export enum RegionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('regions')
export class Region {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  managerId: string;

  @ManyToOne(() => User, user => user.managedRegions, { nullable: true })
  @JoinColumn({ name: 'managerId' })
  manager: User;

  @Column('simple-json', { nullable: true })
  boundaries: {
    type: 'polygon';
    coordinates: number[][][];
  };

  @Column({
    type: 'enum',
    enum: RegionStatus,
    default: RegionStatus.ACTIVE,
  })
  status: RegionStatus;

  @OneToMany(() => Dealer, dealer => dealer.region)
  dealers: Dealer[];

  @OneToMany(() => Territory, territory => territory.region)
  territories: Territory[];

  @OneToMany(() => Restaurant, restaurant => restaurant.region)
  restaurants: Restaurant[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
