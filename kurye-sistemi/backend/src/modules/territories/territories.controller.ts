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
import { TerritoriesService } from './territories.service';
import { CreateTerritoryDto } from './dto/create-territory.dto';
import { UpdateTerritoryDto } from './dto/update-territory.dto';
import { TerritoryStatus } from './entities/territory.entity';

@Controller('territories')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TerritoriesController {
  constructor(private readonly territoriesService: TerritoriesService) {}

  @Post()
  @AdminRoles()
  async create(@Body() createTerritoryDto: CreateTerritoryDto) {
    return this.territoriesService.create(createTerritoryDto);
  }

  @Get()
  @ManagementRoles()
  async findAll(
    @Query('status') status?: TerritoryStatus,
    @Query('regionId') regionId?: string,
    @Query('fieldSalesId') fieldSalesId?: string,
  ) {
    const filters: any = {};
    if (status) filters.status = status;
    if (regionId) filters.regionId = regionId;
    if (fieldSalesId) filters.fieldSalesId = fieldSalesId;
    return this.territoriesService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.territoriesService.findOne(id);
  }

  @Put(':id')
  @ManagementRoles()
  async update(
    @Param('id') id: string,
    @Body() updateTerritoryDto: UpdateTerritoryDto,
  ) {
    return this.territoriesService.update(id, updateTerritoryDto);
  }

  @Delete(':id')
  @AdminRoles()
  async remove(@Param('id') id: string) {
    await this.territoriesService.remove(id);
    return { message: 'Bölge başarıyla silindi' };
  }

  @Post(':id/assign-field-sales')
  @ManagementRoles()
  async assignFieldSales(
    @Param('id') id: string,
    @Body('fieldSalesId') fieldSalesId: string,
  ) {
    return this.territoriesService.assignFieldSales(id, fieldSalesId);
  }
}
