import { Controller, Param, Patch, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderEntity } from './order.entity';
import { DISPUTE_RECEIVE_ENUM } from './dispute.entity';

@Controller('backend/order')
export class OrderController {
  constructor(private orderService: OrderService) {
  }

  @Post('')
  async create() {
    const p = new OrderEntity();
    p.sellerId = 'sellerId';
    p.buyerId = 'buyerId';
    p.productId = 'productId';
    p.productTitle = 'productTitle';
    p.productSpec = '尺码';
    p.productSkuId = 'productSkuId';
    p.skuSpec = 'xxl';
    p.skuPrice = 198;
    p.skuNumber = 2;
    p.contact = '张三';
    p.phone = '18978675645';
    p.address = '北京市西城区剑南大道 20 号';
    p.remark = '尽快发货';
    p.freightAmount = 20;
    p.totalAmount = p.skuPrice * p.skuNumber + p.freightAmount;
    await this.orderService.create(p);
    return null;
  }

  @Patch(':id/payment')
  async payment(@Param('id') id: string) {
    await this.orderService.payment(id);
    return null;
  }

  @Patch(':id/delivery')
  async delivery(@Param('id') id: string) {
    const body = {
      sellerExpressName: '顺丰快递',
      sellerTrackingNumber: '52773381800473',
    };
    await this.orderService.delivery(id, body.sellerExpressName, body.sellerTrackingNumber);
    return null;
  }

  @Patch(':id/received')
  async received(@Param('id') id: string) {

    await this.orderService.received(id);
    return null;
  }
  @Patch(':id/set-cancel')
  async setCancel(@Param('id') id: string) {
    await this.orderService.setCancel(id, '不想买了', '无图');
    return null;
  }
  @Patch(':id/set-cancel-to-approval')
  async setCancelToApproval(@Param('id') id: string) {
    await this.orderService.setCancelToApproval(id);
    return null;
  }
  @Patch(':id/set-cancel-to-failed')
  async setCancelToFailed(@Param('id') id: string) {
    await this.orderService.setCancelToFailed(id, '不行, 就不取消!', '');
    return null;
  }
  @Patch(':id/set-refund')
  async setRefund(@Param('id') id: string) {
    await this.orderService.setRefund(id, '我不想要了!', '', DISPUTE_RECEIVE_ENUM.Received);
    return null;
  }
  @Patch(':id/set-refund-to-approval')
  async setRefundToApproval(@Param('id') id: string) {
    await this.orderService.setRefundToApproval(id);
    return null;
  }
  @Patch(':id/set-refund-to-failed')
  async setRefundToFailed(@Param('id') id: string) {
    await this.orderService.setRefundToFailed(id, '不行, 就不退款!', '');
    return null;
  }
}
