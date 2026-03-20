import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MapsService } from './maps.service';
import { MapsController } from './maps.controller';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    HttpModule,
    RedisModule,
  ],
  providers: [MapsService],
  controllers: [MapsController],
  exports: [MapsService],
})
export class MapsModule {}
