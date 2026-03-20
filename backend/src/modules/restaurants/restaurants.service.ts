import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant, RestaurantUser } from './entities/restaurant.entity';
import { CreateRestaurantWizardDto } from './dto/create-restaurant-wizard.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(RestaurantUser)
    private restaurantUserRepository: Repository<RestaurantUser>,
  ) {}

  // ============================================
  // WIZARD - TÜM ADIMLARI KAYDET
  // ============================================
  async createFromWizard(dto: CreateRestaurantWizardDto): Promise<Restaurant> {
    // API Key oluştur
    const apiKey = `pk_live_${crypto.randomBytes(24).toString('hex')}`;

    // Restoran oluştur
    const restaurant = this.restaurantRepository.create({
      // Adım 1: Temel Bilgiler
      name: dto.basicInfo.name,
      brandName: dto.basicInfo.brandName,
      email: dto.basicInfo.email,
      taxNumber: dto.basicInfo.taxNumber,

      // Adım 2: İşletme Ayarları
      supportPhone: dto.businessSettings.supportPhone,
      technicalContactName: dto.businessSettings.technicalContactName,
      creditCardCommission: dto.businessSettings.creditCardCommission || 0,
      pickupTimeMinutes: dto.businessSettings.pickupTimeMinutes || 30,

      // Adım 3: Çalışma Tipi (6 farklı tip)
      pricingType: dto.pricing.pricingType,
      pricingConfig: dto.pricing.pricingConfig,

      // Adım 5: Konum
      address: dto.locationData.address,
      location: dto.locationData.location,

      // Bayi
      dealerId: dto.dealerId,

      // Extension
      apiKey,
      extensionEnabled: true,

      // Durum
      isActive: true,
    });

    const savedRestaurant = await this.restaurantRepository.save(restaurant);

    // Adım 4: Kullanıcıları oluştur
    for (const userDto of dto.users) {
      const hashedPassword = await bcrypt.hash(userDto.password, 10);
      
      const user = this.restaurantUserRepository.create({
        restaurantId: savedRestaurant.id,
        fullName: userDto.fullName,
        phone: userDto.phone,
        role: userDto.role,
        username: userDto.username,
        password: hashedPassword,
        isActive: true,
      });

      await this.restaurantUserRepository.save(user);
    }

    return savedRestaurant;
  }

  // ============================================
  // RESTORAN LİSTELEME (Bayi bazlı)
  // ============================================
  async findByDealer(dealerId: string): Promise<Restaurant[]> {
    return this.restaurantRepository.find({
      where: { dealerId },
      order: { createdAt: 'DESC' },
    });
  }

  // ============================================
  // RESTORAN DETAYI
  // ============================================
  async findOne(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
    });

    if (!restaurant) {
      throw new NotFoundException('Restoran bulunamadı');
    }

    // Kullanıcıları da getir
    const users = await this.restaurantUserRepository.find({
      where: { restaurantId: id },
    });

    return { ...restaurant, users } as Restaurant;
  }

  // ============================================
  // MAHALLE LİSTESİ (Bölge bazlı için)
  // ============================================
  async getNeighborhoods(district: string, city: string): Promise<string[]> {
    // Bu veri genellikle harici bir API'den veya
    // statik bir listeden gelir
    // Örnek: Mahalle listesi veritabanında saklanabilir
    
    // Şimdilik örnek veri dönelim
    const neighborhoods: Record<string, string[]> = {
      'Kadıköy': [
        'Caferağa', 'Osmanağa', 'Moda', 'Feneryolu', 
        'Fikirtepe', 'Göztepe', 'Hasanpaşa', 'Koşuyolu'
      ],
      'Beşiktaş': [
        'Bebek', 'Etiler', 'Levent', 'Ortaköy', 
        'Ulus', 'Yıldız', 'Arnavutköy'
      ],
    };

    return neighborhoods[district] || [];
  }

  // ============================================
  // ADRES ARAMA (Geocoding)
  // ============================================
  async searchAddress(query: string): Promise<Array<{
    address: string;
    lat: number;
    lng: number;
    district: string;
    city: string;
  }>> {
    // Google Places API veya benzeri bir servis kullanılabilir
    // Şimdilik mock veri dönelim
    
    return [
      {
        address: 'Caferağa Mah. Mühürdar Cad. No:5, Kadıköy/İstanbul',
        lat: 40.9823,
        lng: 29.0254,
        district: 'Kadıköy',
        city: 'İstanbul',
      },
      {
        address: 'Moda Cad. No:10, Kadıköy/İstanbul',
        lat: 40.9810,
        lng: 29.0240,
        district: 'Kadıköy',
        city: 'İstanbul',
      },
    ];
  }

  // ============================================
  // API KEY YENİLEME
  // ============================================
  async regenerateApiKey(restaurantId: string): Promise<string> {
    const restaurant = await this.findOne(restaurantId);
    
    const newApiKey = `pk_live_${crypto.randomBytes(24).toString('hex')}`;
    
    restaurant.apiKey = newApiKey;
    await this.restaurantRepository.save(restaurant);
    
    return newApiKey;
  }
}
