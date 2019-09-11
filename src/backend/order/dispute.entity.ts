import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

export enum DISPUTE_RECEIVE_ENUM {
  UnReceive = 0, // 未收到货
  Received = 1, // 已收到货
}

export enum DISPUTE_TYPE_ENUM {
  Cancel = 1, // 取消订单
  Refund = 2, // 退货退款
}

export enum DISPUTE_STATUS_ENUM {
  Processing = 1,
  Approval = 2,
  Failed = 3,
}

@Entity({ name: 'dispute' })
export class DisputeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id' })
  orderId: string;

  @Column({ name: 'buyer_reason' })
  buyerReason: string;

  @Column({ name: 'buyer_evidence' })
  buyerEvidence: string;

  @Column({ name: 'seller_reason' })
  sellerReason: string;

  @Column({ name: 'seller_evidence' })
  sellerEvidence: string;

  @Column({ enum: DISPUTE_RECEIVE_ENUM })
  received: DISPUTE_RECEIVE_ENUM;

  @Column({ enum: DISPUTE_TYPE_ENUM })
  type: DISPUTE_TYPE_ENUM;

  @Column({ name: 'review_at' })
  reviewAt: Date;

  @Column({ name: 'approval_at' })
  approvalAt: Date;

  @Column({ name: 'failed_at' })
  failedAt: Date;

  @Column({ enum: DISPUTE_STATUS_ENUM })
  status: DISPUTE_STATUS_ENUM;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
