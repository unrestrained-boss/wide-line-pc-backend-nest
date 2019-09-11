import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ORDER_STATUS_ENUM, OrderEntity, PAYMENT_TYPE_ENUM } from './order.entity';
import { ParamsException } from '../../shared/all-exception.exception';
import { DISPUTE_RECEIVE_ENUM, DISPUTE_STATUS_ENUM, DISPUTE_TYPE_ENUM, DisputeEntity } from './dispute.entity';

// interface OrderCreateBody {
//   sellerId: string;
//   buyerId: string;
//   productId: string;
//   productTitle: string;
//   productSpec: string;
//   productSkuId: string;
//   skuSpec: string;
//   skuPrice: string;
//   skuNumber: string;
//   totalAmount: number;
//   freightAmount: number;
//
//   contact: string;
//   phone: string;
//   address: string;
//   remark: string;
// }

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    public repository: Repository<OrderEntity>,
  ) {
  }

  // 买家创建订单
  async create(orderEntity: OrderEntity) {
    await this.repository.save(orderEntity);
  }

  // 买家支付
  async payment(id: string) {
    // 模拟支付成功
    await this.repository.manager.transaction(async e => {
      const record = await e.findOne<OrderEntity>(OrderEntity, id);
      // 订单必须存在
      // 订单必须是待支付状态
      if (!record) {
        throw new ParamsException('订单不存在');
      }
      if (record.status !== ORDER_STATUS_ENUM.UnPayment) {
        throw new ParamsException('订单已支付或是其他状态');
      }
      // 修改为待发货
      record.status = ORDER_STATUS_ENUM.UnDelivery;
      // 修改支付时间
      record.paymentAt = new Date();
      // 修改支付方式
      record.paymentType = PAYMENT_TYPE_ENUM.Wechat;
      // 修改实付款
      record.actuallyAmount = record.totalAmount;
      await e.save<OrderEntity>(record);
    });
  }

  // 卖家发货
  async delivery(id: string, sellerExpressName: string, sellerTrackingNumber: string) {
    await this.repository.manager.transaction(async e => {
      const record = await e.findOne<OrderEntity>(OrderEntity, id);
      // 订单必须存在
      // 订单必须是待发货状态
      if (!record) {
        throw new ParamsException('订单不存在');
      }
      if (record.status !== ORDER_STATUS_ENUM.UnDelivery) {
        throw new ParamsException('订单已发货或是其他状态');
      }
      // 修改为待收货
      record.status = ORDER_STATUS_ENUM.UnReceive;
      // 修改发货时间
      record.deliveryAt = new Date();
      // 修改快递公司
      record.sellerExpressName = sellerExpressName;
      // 修改快递单号
      record.sellerTrackingNumber = sellerTrackingNumber;
      await e.save<OrderEntity>(record);
    });
  }

  // 买家确认收货
  async received(id: string) {
    await this.repository.manager.transaction(async e => {
      const record = await e.findOne<OrderEntity>(OrderEntity, id);
      // 订单必须存在
      // 订单必须是待确认收货状态
      if (!record) {
        throw new ParamsException('订单不存在');
      }
      if (record.status !== ORDER_STATUS_ENUM.UnReceive) {
        throw new ParamsException('订单已发货或是其他状态');
      }
      // 修改为已确认收货
      record.status = ORDER_STATUS_ENUM.Received;
      // 修改确认收货时间
      record.receivedAt = new Date();
      await e.save<OrderEntity>(record);
    });
  }

  // 买家提交取消申请
  async setCancel(id: string, reason: string, evidence: string) {
    await this.repository.manager.transaction(async e => {
      const record = await e.findOne<OrderEntity>(OrderEntity, id);
      // 订单必须存在
      if (!record) {
        throw new ParamsException('订单不存在');
      }
      // 如果订单不是未支付 和 未发货 无法取消
      if (
        record.status !== ORDER_STATUS_ENUM.UnPayment
        && record.status !== ORDER_STATUS_ENUM.UnDelivery
      ) {
        throw new ParamsException('当前状态无法执行取消操作');
      }
      const disputeEntity = new DisputeEntity();
      disputeEntity.orderId = record.id;
      disputeEntity.buyerReason = reason;
      disputeEntity.buyerEvidence = evidence;
      // 争议类型: 取消
      disputeEntity.type = DISPUTE_TYPE_ENUM.Cancel;
      disputeEntity.reviewAt = new Date();
      // 未收到货
      disputeEntity.received = DISPUTE_RECEIVE_ENUM.UnReceive;
      disputeEntity.sellerReason = '';
      disputeEntity.sellerEvidence = '';
      // 记录正常时的 id
      record.disputeStatus = record.status;
      // 如果订单未支付 可以直接取消
      if (record.status === ORDER_STATUS_ENUM.UnPayment) {
        record.status = ORDER_STATUS_ENUM.Canceled;
        record.canceledAt = new Date();
        // 当前状态: 等待卖家同意取消
        disputeEntity.status = DISPUTE_STATUS_ENUM.Approval;
        disputeEntity.approvalAt = new Date();
        disputeEntity.sellerReason = '买家尚未支付, 主动取消订单';
        disputeEntity.sellerEvidence = '';
        // 如果订单未发货
      } else if (record.status === ORDER_STATUS_ENUM.UnDelivery) {
        // 修改为取消申请中
        record.status = ORDER_STATUS_ENUM.CancelReview;
        // 当前状态: 等待卖家处理
        disputeEntity.status = DISPUTE_STATUS_ENUM.Processing;
      }
      await e.save<OrderEntity>(record);
      // 添加争议数据
      await e.save<DisputeEntity>(disputeEntity);
    });
  }

  // 卖家取消申请通过
  async setCancelToApproval(id: string) {
    await this.repository.manager.transaction(async e => {
      const record = await e.findOne<OrderEntity>(OrderEntity, id);
      // 订单必须存在
      if (!record) {
        throw new ParamsException('订单不存在');
      }
      if (record.status !== ORDER_STATUS_ENUM.CancelReview) {
        throw new ParamsException('订单不在取消申请中');
      }
      const disRecord = await e.findOne<DisputeEntity>(DisputeEntity, {
        where: {
          orderId: record.id,
          type: DISPUTE_TYPE_ENUM.Cancel,
          status: DISPUTE_STATUS_ENUM.Processing,
        },
      });
      if (!disRecord) {
        throw new ParamsException('订单取消申请不存在');
      }
      disRecord.status = DISPUTE_STATUS_ENUM.Approval;
      disRecord.approvalAt = new Date();
      record.status = ORDER_STATUS_ENUM.Canceled;
      record.canceledAt = new Date();
      await e.save<OrderEntity>(record);
      await e.save<DisputeEntity>(disRecord);
    });
  }

  // 卖家取消申请不通过
  async setCancelToFailed(id: string, reason: string, evidence: string) {
    await this.repository.manager.transaction(async e => {
      const record = await e.findOne<OrderEntity>(OrderEntity, id);
      // 订单必须存在
      if (!record) {
        throw new ParamsException('订单不存在');
      }
      if (record.status !== ORDER_STATUS_ENUM.CancelReview) {
        throw new ParamsException('订单不在取消申请中');
      }
      const disRecord = await e.findOne<DisputeEntity>(DisputeEntity, {
        where: {
          orderId: record.id,
          type: DISPUTE_TYPE_ENUM.Cancel,
          status: DISPUTE_STATUS_ENUM.Processing,
        },
      });
      if (!disRecord) {
        throw new ParamsException('订单取消申请不存在');
      }
      disRecord.status = DISPUTE_STATUS_ENUM.Failed;
      disRecord.failedAt = new Date();
      disRecord.sellerReason = reason;
      disRecord.sellerEvidence = evidence;
      record.status = record.disputeStatus;
      record.disputeStatus = null;
      await e.save<OrderEntity>(record);
      await e.save<DisputeEntity>(disRecord);
    });

  }

  // 买家提交退货申请
  async setRefund(id: string, reason: string, evidence: string, received: DISPUTE_RECEIVE_ENUM) {
    await this.repository.manager.transaction(async e => {
      const record = await e.findOne<OrderEntity>(OrderEntity, id);
      // 订单必须存在
      if (!record) {
        throw new ParamsException('订单不存在');
      }
      // 如果订单不是待收货
      if (
        record.status !== ORDER_STATUS_ENUM.UnReceive
      ) {
        throw new ParamsException('当前状态无法执行退货/退款操作');
      }
      const disputeEntity = new DisputeEntity();
      disputeEntity.orderId = record.id;
      disputeEntity.buyerReason = reason;
      disputeEntity.buyerEvidence = evidence;
      // 争议类型: 取消
      disputeEntity.type = DISPUTE_TYPE_ENUM.Refund;
      disputeEntity.reviewAt = new Date();
      // 未收到货
      disputeEntity.received = received;
      disputeEntity.sellerReason = '';
      disputeEntity.sellerEvidence = '';
      // 记录正常时的 id
      record.disputeStatus = record.status;
      record.status = ORDER_STATUS_ENUM.RefundReview;
      await e.save<OrderEntity>(record);
      // 添加争议数据
      await e.save<DisputeEntity>(disputeEntity);
    });
  }

  // 卖家退货申请通过
  async setRefundToApproval(id: string) {
    await this.repository.manager.transaction(async e => {
      const record = await e.findOne<OrderEntity>(OrderEntity, id);
      // 订单必须存在
      if (!record) {
        throw new ParamsException('订单不存在');
      }
      if (record.status !== ORDER_STATUS_ENUM.RefundReview) {
        throw new ParamsException('订单不在退款/退货申请中');
      }
      const disRecord = await e.findOne<DisputeEntity>(DisputeEntity, {
        where: {
          orderId: record.id,
          type: DISPUTE_TYPE_ENUM.Refund,
          status: DISPUTE_STATUS_ENUM.Processing,
        },
      });
      if (!disRecord) {
        throw new ParamsException('订单退款/退货申请不存在');
      }
      disRecord.status = DISPUTE_STATUS_ENUM.Approval;
      disRecord.approvalAt = new Date();
      record.status = ORDER_STATUS_ENUM.Refunded;
      record.refundedAt = new Date();
      await e.save<OrderEntity>(record);
      await e.save<DisputeEntity>(disRecord);
    });
  }

  // 卖家退货申请不通过
  async setRefundToFailed(id: string, reason: string, evidence: string) {
    await this.repository.manager.transaction(async e => {
      const record = await e.findOne<OrderEntity>(OrderEntity, id);
      // 订单必须存在
      if (!record) {
        throw new ParamsException('订单不存在');
      }
      if (record.status !== ORDER_STATUS_ENUM.RefundReview) {
        throw new ParamsException('订单不在退款/退货申请中');
      }
      const disRecord = await e.findOne<DisputeEntity>(DisputeEntity, {
        where: {
          orderId: record.id,
          type: DISPUTE_TYPE_ENUM.Refund,
          status: DISPUTE_STATUS_ENUM.Processing,
        },
      });
      if (!disRecord) {
        throw new ParamsException('订单退款/退货申请不存在');
      }
      disRecord.status = DISPUTE_STATUS_ENUM.Failed;
      disRecord.failedAt = new Date();
      disRecord.sellerReason = reason;
      disRecord.sellerEvidence = evidence;
      record.status = record.disputeStatus;
      record.disputeStatus = null;
      await e.save<OrderEntity>(record);
      await e.save<DisputeEntity>(disRecord);
    });
  }
}
