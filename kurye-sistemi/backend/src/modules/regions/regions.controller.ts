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
import { RegionsService } from './regions.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { RegionStatus } from './entities/region.entity';

@Controller('regions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Post()
  @AdminRoles()
  async create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionsService.create(createRegionDto);
  }

  @Get()
  @ManagementRoles()
  async findAll(
    @Query('status') status?: RegionStatus,
    @Query('managerId') managerId?: string,
  ) {
    const filters: any = {};
    if (status) filters.status = status;
    if (managerId) filters.managerId = managerId;
    return this.regionsService.findAll(filters);
  }

  @Get('stats')
  @ManagementRoles()
  async getAllStats() {
    return this.regionsService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.regionsService.findOne(id);
  }

  @Get(':id/stats')
  @ManagementRoles()
  async getStats(@Param('id') id: string) {
    return this.regionsService.getStats(id);
  }

  @Put(':id')
  @AdminRoles()
  async update(
    @Param('id') id: string,
    @Body() updateRegionDto: UpdateRegionDto,
  ) {
    return this.regionsService.update(id, updateRegionDto);
  }

  @Delete(':id')
  @AdminRoles()
  async remove(@Param('id') id: string) {
    await this.regionsService.remove(id);
    return { message: 'Bölge başarıyla silindi' };
  }
}
