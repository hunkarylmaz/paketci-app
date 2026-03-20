import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { UserRole, RoleLevel } from '../enums/user-role.enum';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.COURIER })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  companyId: string;

  @ManyToOne(() => Company, company => company.users)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  // Yeni alanlar - Yetki ve atama sistemi
  
  // Bölge sorumlusu için bölge ataması
  @Column({ nullable: true })
  regionId: string;

  @Column({ nullable: true })
  regionName: string;

  // Bayi ataması (bayi kullanıcıları için)
  @Column({ nullable: true })
  dealerId: string;

  @Column({ nullable: true })
  dealerName: string;

  // Saha satış için bölge/territory ataması
  @Column({ nullable: true })
  territoryId: string;

  @Column({ nullable: true })
  territoryName: string;

  // Muhasebe için departman ataması
  @Column({ nullable: true })
  department: string;

  // Raporlama hiyerarşisi için üst kullanıcı
  @Column({ nullable: true })
  reportsToId: string;

  @ManyToOne(() => User, user => user.subordinates)
  @JoinColumn({ name: 'reportsToId' })
  reportsTo: User;

  @OneToMany(() => User, user => user.reportsTo)
  subordinates: User[];

  // Atanan restoranlar (saha satış, bölge sorumlusu için)
  @Column('simple-array', { nullable: true })
  assignedRestaurantIds: string[];

  // Atanan bayiler (bölge sorumlusu için)
  @Column('simple-array', { nullable: true })
  assignedDealerIds: string[];

  // Saha satış hedefleri
  @Column({ type: 'int', nullable: true })
  monthlyTarget: number;

  @Column({ type: 'int', nullable: true })
  monthlyVisitsTarget: number;

  // İzinler (özel yetkiler için)
  @Column('simple-json', { nullable: true })
  customPermissions: string[];

  // Kısıtlamalar (sadece görüntüleme, sadece kendi bölgesi vb.)
  @Column('simple-json', { nullable: true })
  restrictions: {
    viewOnly?: boolean;
    ownRegionOnly?: boolean;
    ownDealerOnly?: boolean;
    ownRestaurantsOnly?: boolean;
  };

  @Column({ nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
