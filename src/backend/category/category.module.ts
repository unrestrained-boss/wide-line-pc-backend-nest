import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature(
      [CategoryEntity],
    ),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
