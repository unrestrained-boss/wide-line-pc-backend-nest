import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandEntity } from './brand.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature(
      [BrandEntity],
    ),
  ],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
