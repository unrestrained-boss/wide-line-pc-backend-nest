import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { DisputeEntity } from './dispute.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature(
      [OrderEntity, DisputeEntity],
    ),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
