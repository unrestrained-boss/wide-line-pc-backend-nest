import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Optional } from '@nestjs/common';

export enum PAYMENT_TYPE_ENUM {
  Wechat = 1,
  Alipay = 2,
}

export enum ORDER_STATUS_ENUM {
  UnPayment = 1, // 待付款
  UnDelivery = 2, // 待发货
  UnReceive = 3, // 待收货
  Received = 4, // 已确认收货
  Finished = 5, // 已完成
  CancelReview = 6, // 取消审核中
  // CancelApproval = 7, // 取消审核通过
  // CancelFailed = 8, // 取消审核不通过
  Canceled = 7, // 已取消
  RefundReview = 8, // 退款/退货审核中
  // RefundApproval = 11, // 退款/退货审核通过
  // RefundFailed = 12, // 退款/退货审核不通过
  Refunded = 9, //  已退款/退货
}

@Entity({ name: 'order' })
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'seller_id' })
  sellerId: string;
  @Column({ name: 'buyer_id' })
  buyerId: string;

  @Column({ name: 'product_id' })
  productId: string;
  @Column({ name: 'product_title' })
  productTitle: string;
  @Column({ name: 'product_spec' })
  productSpec: string;
  @Column({ name: 'product_sku_id' })
  productSkuId: string;
  @Column({ name: 'sku_spec' })
  skuSpec: string;
  @Column({ name: 'sku_price' })
  skuPrice: number;
  @Column({ name: 'sku_number' })
  skuNumber: number;

  @Column({ name: 'total_amount' })
  totalAmount: number;
  @Column({ name: 'actually_amount' })
  actuallyAmount: number;
  @Column({ name: 'freight_amount' })
  freightAmount: number;
  @Column({ name: 'payment_type' })
  paymentType: number;

  @Column({ name: 'order_at' })
  orderAt: Date;
  @Column({ name: 'payment_at' })
  paymentAt: Date;
  @Column({ name: 'delivery_at' })
  deliveryAt: Date;
  @Column({ name: 'received_at' })
  receivedAt: Date;
  @Column({ name: 'finished_at' })
  finishedAt: Date;
  @Column({ name: 'canceled_at' })
  canceledAt: Date;
  @Column({ name: 'refunded_at' })
  refundedAt: Date;

  @Column({ name: 'seller_express_name' })
  sellerExpressName: string;
  @Column({ name: 'seller_tracking_number' })
  sellerTrackingNumber: string;
  @Column({ name: 'buyer_express_name' })
  buyerExpressName: string;
  @Column({ name: 'buyer_tracking_number' })
  buyerTrackingNumber: string;

  @ApiModelProperty()
  @IsNotEmpty({ message: '请输入联系人名称' })
  @Column()
  contact: string;
  @ApiModelProperty()
  @IsNotEmpty({ message: '请输入联系人电话' })
  @Column()
  phone: string;
  @ApiModelProperty()
  @IsNotEmpty({ message: '请输入联系人详细地址' })
  @Column()
  address: string;

  @ApiModelPropertyOptional()
  @Column()
  @Optional()
  remark: string;

  @Column({ name: 'dispute_status', enum: ORDER_STATUS_ENUM })
  disputeStatus: ORDER_STATUS_ENUM;

  @Column({ enum: ORDER_STATUS_ENUM })
  status: ORDER_STATUS_ENUM;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  //
  // @OneToMany(type => ProductEntity, productEntity => productEntity.brand)
  // products: ProductEntity[];
}
