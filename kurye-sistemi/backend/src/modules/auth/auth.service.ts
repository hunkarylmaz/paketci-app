import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/user-role.enum';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'password', 'firstName', 'lastName', 'role', 'companyId', 'status'],
    });
    
    if (!user) return null;
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    
    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Geçersiz email veya şifre');
    }

    await this.userRepository.update(user.id, { lastLoginAt: new Date() });

    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role,
      companyId: user.companyId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyId: user.companyId,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existing = await this.userRepository.findOne({ 
      where: { email: registerDto.email } 
    });
    
    if (existing) {
      throw new ConflictException('Bu email adresi zaten kullanımda');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      role: (registerDto.role as UserRole) || UserRole.COMPANY_ADMIN,
    });

    await this.userRepository.save(user);
    
    const { password, ...result } = user;
    return result;
  }

  async getProfile(userId: string) {
    return this.userRepository.findOne({ 
      where: { id: userId },
      relations: ['company'],
    });
  }
}
