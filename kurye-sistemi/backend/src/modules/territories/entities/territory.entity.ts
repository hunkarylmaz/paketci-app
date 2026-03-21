// Territory Entity - Bölge Yönetimi için
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Region } from '../../regions/entities/region.entity';

@Entity('territories')
export class Territory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  regionId: string;

  @ManyToOne(() => Region, region => region.territories, { nullable: true })
  @JoinColumn({ name: 'regionId' })
  region: Region;

  @OneToMany(() => User, user => user.assignedTerritories)
  fieldSales: User[];

  @Column({ nullable: true })
  assignedToId: string;

  @ManyToOne(() => User, user => user.assignedTerritories, { nullable: true })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo: User;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
