import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature(
      [ProductEntity],
    ),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
