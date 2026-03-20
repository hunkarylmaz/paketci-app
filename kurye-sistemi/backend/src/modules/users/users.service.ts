import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from './entities/user.entity';
import { UserRole, RoleDescriptions, RoleLevel } from './enums/user-role.enum';
import * as bcrypt from 'bcrypt';

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  companyId?: string;
  // Yeni alanlar
  regionId?: string;
  regionName?: string;
  dealerId?: string;
  dealerName?: string;
  territoryId?: string;
  territoryName?: string;
  department?: string;
  reportsToId?: string;
  assignedRestaurantIds?: string[];
  assignedDealerIds?: string[];
  monthlyTarget?: number;
  monthlyVisitsTarget?: number;
  restrictions?: {
    viewOnly?: boolean;
    ownRegionOnly?: boolean;
    ownDealerOnly?: boolean;
    ownRestaurantsOnly?: boolean;
  };
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  status?: UserStatus;
}

export interface AssignUserDto {
  restaurantIds?: string[];
  dealerIds?: string[];
  regionId?: string;
  reportsToId?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Tüm kullanıcıları getir
  async findAll(filters?: {
    role?: UserRole;
    companyId?: string;
    regionId?: string;
    dealerId?: string;
    status?: UserStatus;
  }): Promise<User[]> {
    const query = this.userRepository.createQueryBuilder('user');

    if (filters?.role) {
      query.andWhere('user.role = :role', { role: filters.role });
    }
    if (filters?.companyId) {
      query.andWhere('user.companyId = :companyId', { companyId: filters.companyId });
    }
    if (filters?.regionId) {
      query.andWhere('user.regionId = :regionId', { regionId: filters.regionId });
    }
    if (filters?.dealerId) {
      query.andWhere('user.dealerId = :dealerId', { dealerId: filters.dealerId });
    }
    if (filters?.status) {
      query.andWhere('user.status = :status', { status: filters.status });
    }

    return query
      .leftJoinAndSelect('user.company', 'company')
      .leftJoinAndSelect('user.reportsTo', 'reportsTo')
      .leftJoinAndSelect('user.subordinates', 'subordinates')
      .getMany();
  }

  // ID ile kullanıcı getir
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['company', 'reportsTo', 'subordinates'],
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    return user;
  }

  // Email ile kullanıcı getir
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['company', 'reportsTo', 'subordinates'],
    });
  }

  // Yeni kullanıcı oluştur
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Email kontrolü
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Bu email adresi zaten kullanımda');
    }

    // Şifre hashleme
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  // Kullanıcı güncelle
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    // Email değişiyorsa kontrol et
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Bu email adresi zaten kullanımda');
      }
    }

    // Şifre değişiyorsa hashle
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  // Kullanıcı sil (soft delete)
  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    user.status = UserStatus.INACTIVE;
    await this.userRepository.save(user);
  }

  // Kullanıcıya atama yap
  async assignUser(id: string, assignDto: AssignUserDto): Promise<User> {
    const user = await this.findById(id);

    if (assignDto.restaurantIds !== undefined) {
      user.assignedRestaurantIds = assignDto.restaurantIds;
    }
    if (assignDto.dealerIds !== undefined) {
      user.assignedDealerIds = assignDto.dealerIds;
    }
    if (assignDto.regionId !== undefined) {
      user.regionId = assignDto.regionId;
    }
    if (assignDto.reportsToId !== undefined) {
      user.reportsToId = assignDto.reportsToId;
    }

    return this.userRepository.save(user);
  }

  // Rol bazlı kullanıcıları getir
  async findByRole(role: UserRole, companyId?: string): Promise<User[]> {
    const filters: any = { role };
    if (companyId) {
      filters.companyId = companyId;
    }
    return this.findAll(filters);
  }

  // Bölge sorumlularını getir
  async findRegionalManagers(regionId?: string): Promise<User[]> {
    const filters: any = { role: UserRole.REGIONAL_MANAGER };
    if (regionId) {
      filters.regionId = regionId;
    }
    return this.findAll(filters);
  }

  // Bayileri getir
  async findDealers(regionId?: string): Promise<User[]> {
    const filters: any = { role: UserRole.DEALER };
    if (regionId) {
      filters.regionId = regionId;
    }
    return this.findAll(filters);
  }

  // Saha satış temsilcilerini getir
  async findFieldSales(territoryId?: string): Promise<User[]> {
    const filters: any = { role: UserRole.FIELD_SALES };
    if (territoryId) {
      filters.territoryId = territoryId;
    }
    return this.findAll(filters);
  }

  // Muhasebecileri getir
  async findAccountants(department?: string): Promise<User[]> {
    const filters: any = { role: UserRole.ACCOUNTANT };
    if (department) {
      filters.department = department;
    }
    return this.findAll(filters);
  }

  // Operasyon destek personelini getir
  async findOperationsSupport(regionId?: string): Promise<User[]> {
    const filters: any = { role: UserRole.OPERATIONS_SUPPORT };
    if (regionId) {
      filters.regionId = regionId;
    }
    return this.findAll(filters);
  }

  // Alt çalışanları getir (hiyerarşi)
  async findSubordinates(managerId: string): Promise<User[]> {
    return this.userRepository.find({
      where: { reportsToId: managerId },
      relations: ['company'],
    });
  }

  // Kullanıcının erişebileceği kaynakları getir
  async getAccessibleResources(userId: string): Promise<{
    restaurantIds: string[];
    dealerIds: string[];
    regionIds: string[];
  }> {
    const user = await this.findById(userId);

    const result = {
      restaurantIds: user.assignedRestaurantIds || [],
      dealerIds: user.assignedDealerIds || [],
      regionIds: user.regionId ? [user.regionId] : [],
    };

    // Bölge sorumlusu tüm bölgedeki kaynaklara erişir
    if (user.role === UserRole.REGIONAL_MANAGER && user.regionId) {
      // Burada bölgedeki tüm restoran ve bayileri getirme mantığı eklenebilir
    }

    return result;
  }

  // Rol listesini getir
  getRoleList(): Array<{
    role: UserRole;
    description: string;
    level: number;
    color: string;
  }> {
    return Object.values(UserRole).map(role => ({
      role,
      description: RoleDescriptions[role],
      level: RoleLevel[role],
      color: this.getRoleColor(role),
    }));
  }

  private getRoleColor(role: UserRole): string {
    const colors: Record<UserRole, string> = {
      [UserRole.SUPER_ADMIN]: '#DC2626',
      [UserRole.COMPANY_ADMIN]: '#7C3AED',
      [UserRole.REGIONAL_MANAGER]: '#2563EB',
      [UserRole.MANAGER]: '#059669',
      [UserRole.ACCOUNTANT]: '#D97706',
      [UserRole.FIELD_SALES]: '#0891B2',
      [UserRole.OPERATIONS_SUPPORT]: '#7C3AED',
      [UserRole.DEALER]: '#BE185D',
      [UserRole.RESTAURANT]: '#4338CA',
      [UserRole.COURIER]: '#0891B2',
    };
    return colors[role] || '#6B7280';
  }

  // Son girişi güncelle
  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.update(id, { lastLoginAt: new Date() });
  }
}
