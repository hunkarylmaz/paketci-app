import { Command, CommandRunner, Option } from 'nest-commander';
import { UserSeedService } from '../modules/users/user-seed.service';
import { Logger } from '@nestjs/common';

@Command({
  name: 'seed:users',
  description: 'Varsayılan kullanıcıları oluştur',
})
export class SeedUsersCommand extends CommandRunner {
  private readonly logger = new Logger(SeedUsersCommand.name);

  constructor(private readonly userSeedService: UserSeedService) {
    super();
  }

  async run(): Promise<void> {
    this.logger.log('Kullanıcı seed işlemi başlıyor...');
    
    try {
      await this.userSeedService.seedDefaultUsers();
      this.logger.log('✅ Kullanıcılar başarıyla oluşturuldu');
      
      const users = await this.userSeedService.getAllUsers();
      console.log('\n📋 Oluşturulan Kullanıcılar:');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('Rol                    │ E-posta                     │ Ad Soyad');
      console.log('═══════════════════════════════════════════════════════════');
      
      users.forEach(user => {
        const role = user.role.padEnd(22);
        const email = user.email.padEnd(27);
        const name = `${user.firstName} ${user.lastName}`;
        console.log(`${role}│ ${email}│ ${name}`);
      });
      
      console.log('═══════════════════════════════════════════════════════════');
      console.log('\n🔑 Varsayılan Şifreler: RolAdi@2024! (örn: Admin@2024!)');
      console.log('⚠️  Üretim ortamında şifreleri değiştirin!\n');
      
      process.exit(0);
    } catch (error) {
      this.logger.error('❌ Kullanıcı oluşturma hatası:', error.message);
      process.exit(1);
    }
  }
}

@Command({
  name: 'seed:reset-password',
  description: 'Kullanıcı şifresini sıfırla',
})
export class ResetPasswordCommand extends CommandRunner {
  private readonly logger = new Logger(ResetPasswordCommand.name);

  constructor(private readonly userSeedService: UserSeedService) {
    super();
  }

  @Option({
    flags: '-e, --email [email]',
    description: 'Kullanıcı e-posta adresi',
  })
  email: string;

  @Option({
    flags: '-p, --password [password]',
    description: 'Yeni şifre',
  })
  password: string;

  async run(): Promise<void> {
    if (!this.email || !this.password) {
      this.logger.error('E-posta ve şifre gereklidir');
      console.log('Kullanım: npm run seed:reset-password -- -e user@paketci.app -p YeniSifre123!');
      process.exit(1);
    }

    try {
      await this.userSeedService.resetPassword(this.email, this.password);
      this.logger.log(`✅ ${this.email} kullanıcısının şifresi sıfırlandı`);
      process.exit(0);
    } catch (error) {
      this.logger.error('❌ Şifre sıfırlama hatası:', error.message);
      process.exit(1);
    }
  }
}

@Command({
  name: 'seed:list',
  description: 'Tüm kullanıcıları listele',
})
export class ListUsersCommand extends CommandRunner {
  private readonly logger = new Logger(ListUsersCommand.name);

  constructor(private readonly userSeedService: UserSeedService) {
    super();
  }

  async run(): Promise<void> {
    const users = await this.userSeedService.getAllUsers();
    
    console.log('\n📋 Sistemdeki Tüm Kullanıcılar:');
    console.log('═══════════════════════════════════════════════════════════════════════');
    console.log('ID                                   │ Rol           │ E-posta                     │ Durum');
    console.log('═══════════════════════════════════════════════════════════════════════');
    
    users.forEach(user => {
      const id = user.id.substring(0, 8).padEnd(36);
      const role = user.role.padEnd(13);
      const email = user.email.padEnd(27);
      const status = user.isActive ? '🟢 Aktif' : '🔴 Pasif';
      console.log(`${id}│ ${role}│ ${email}│ ${status}`);
    });
    
    console.log('═══════════════════════════════════════════════════════════════════════');
    console.log(`Toplam: ${users.length} kullanıcı\n`);
    
    process.exit(0);
  }
}
