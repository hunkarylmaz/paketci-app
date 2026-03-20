import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';

interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  companyId?: string;
  regionId?: string;
  dealerId?: string;
  restaurantId?: string;
  isActive?: boolean;
}

@Injectable()
export class UserSeedService {
  private readonly logger = new Logger(UserSeedService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async seedDefaultUsers(): Promise<void> {
    this.logger.log('Varsayılan kullanıcılar oluşturuluyor...');

    const defaultUsers: CreateUserData[] = [
      // Super Admin
      {
        email: 'admin@paketci.app',
        password: 'Admin@2024!',
        firstName: 'Sistem',
        lastName: 'Yöneticisi',
        role: UserRole.SUPER_ADMIN,
        phone: '+90 532 000 0001',
        isActive: true,
      },
      // Company Admin
      {
        email: 'yonetici@paketci.app',
        password: 'Yonetici@2024!',
        firstName: 'Şirket',
        lastName: 'Yöneticisi',
        role: UserRole.COMPANY_ADMIN,
        phone: '+90 532 000 0002',
        isActive: true,
      },
      // Regional Manager
      {
        email: 'bolge@paketci.app',
        password: 'Bolge@2024!',
        firstName: 'Bölge',
        lastName: 'Sorumlusu',
        role: UserRole.REGIONAL_MANAGER,
        phone: '+90 532 000 0003',
        isActive: true,
      },
      // Manager
      {
        email: 'mudur@paketci.app',
        password: 'Mudur@2024!',
        firstName: 'Restoran',
        lastName: 'Müdürü',
        role: UserRole.MANAGER,
        phone: '+90 532 000 0004',
        isActive: true,
      },
      // Accountant
      {
        email: 'muhasebe@paketci.app',
        password: 'Muhasebe@2024!',
        firstName: 'Muhasebe',
        lastName: 'Yetkilisi',
        role: UserRole.ACCOUNTANT,
        phone: '+90 532 000 0005',
        isActive: true,
      },
      // Field Sales
      {
        email: 'satis@paketci.app',
        password: 'Satis@2024!',
        firstName: 'Saha',
        lastName: 'Satışçı',
        role: UserRole.FIELD_SALES,
        phone: '+90 532 000 0006',
        isActive: true,
      },
      // Operations Support
      {
        email: 'operasyon@paketci.app',
        password: 'Operasyon@2024!',
        firstName: 'Operasyon',
        lastName: 'Destek',
        role: UserRole.OPERATIONS_SUPPORT,
        phone: '+90 532 000 0007',
        isActive: true,
      },
      // Dealer
      {
        email: 'bayi@paketci.app',
        password: 'Bayi@2024!',
        firstName: 'Aydınlar',
        lastName: 'Dağıtım',
        role: UserRole.DEALER,
        phone: '+90 532 000 0008',
        isActive: true,
      },
      // Restaurant
      {
        email: 'restoran@paketci.app',
        password: 'Restoran@2024!',
        firstName: 'Burger King',
        lastName: 'Taksim',
        role: UserRole.RESTAURANT,
        phone: '+90 212 123 4567',
        isActive: true,
      },
      // Courier
      {
        email: 'kurye@paketci.app',
        password: 'Kurye@2024!',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        role: UserRole.COURIER,
        phone: '+90 555 123 4567',
        isActive: true,
      },
      // Courier 2
      {
        email: 'kurye2@paketci.app',
        password: 'Kurye@2024!',
        firstName: 'Mehmet',
        lastName: 'Demir',
        role: UserRole.COURIER,
        phone: '+90 555 987 6543',
        isActive: true,
      },
    ];

    for (const userData of defaultUsers) {
      await this.createUserIfNotExists(userData);
    }

    this.logger.log('Varsayılan kullanıcılar oluşturuldu.');
  }

  private async createUserIfNotExists(userData: CreateUserData): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      this.logger.log(`Kullanıcı zaten var: ${userData.email}`);
      return;
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    await this.userRepository.save(user);
    this.logger.log(`Kullanıcı oluşturuldu: ${userData.email} (${userData.role})`);
  }

  async getAllUsers(): Promise<Partial<User>[]> {
    const users = await this.userRepository.find({
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'phone', 'isActive', 'createdAt'],
    });

    return users;
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);
    
    this.logger.log(`Şifre sıfırlandı: ${email}`);
  }
}
