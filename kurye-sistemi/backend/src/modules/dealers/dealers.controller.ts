import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { AdminRoles, ManagementRoles } from '../auth/decorators/roles.decorator';
import { DealersService } from './dealers.service';
import { CreateDealerDto } from './dto/create-dealer.dto';
import { UpdateDealerDto } from './dto/update-dealer.dto';
import { DealerStatus } from './entities/dealer.entity';

@Controller('dealers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DealersController {
  constructor(private readonly dealersService: DealersService) {}

  @Post()
  @AdminRoles()
  async create(@Body() createDealerDto: CreateDealerDto) {
    return this.dealersService.create(createDealerDto);
  }

  @Get()
  @ManagementRoles()
  async findAll(
    @Query('status') status?: DealerStatus,
    @Query('regionId') regionId?: string,
    @Query('ownerId') ownerId?: string,
  ) {
    const filters: any = {};
    if (status) filters.status = status;
    if (regionId) filters.regionId = regionId;
    if (ownerId) filters.ownerId = ownerId;
    return this.dealersService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.dealersService.findOne(id);
  }

  @Put(':id')
  @ManagementRoles()
  async update(
    @Param('id') id: string,
    @Body() updateDealerDto: UpdateDealerDto,
  ) {
    return this.dealersService.update(id, updateDealerDto);
  }

  @Delete(':id')
  @AdminRoles()
  async remove(@Param('id') id: string) {
    await this.dealersService.remove(id);
    return { message: 'Bayi başarıyla silindi' };
  }

  @Get(':id/commission-report')
  @ManagementRoles()
  async getCommissionReport(
    @Param('id') id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.dealersService.getCommissionReport(id, start, end);
  }

  @Get(':id/performance')
  @ManagementRoles()
  async getPerformance(@Param('id') id: string) {
    return this.dealersService.getPerformance(id);
  }
}
