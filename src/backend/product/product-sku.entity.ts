import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsEnum, IsNotEmpty, MaxLength, Min, IsNumber, IsDecimal } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { ENTITY_STATUS_ENUM } from '../../shared/constant';

@Entity({ name: 'product_sku' })
export class ProductSkuEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiModelProperty()
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: '产品价格格式错误' })
  @IsNotEmpty({ message: '请输入产品价格' })
  @Min(0.01, { message: '产品价格不能低于 0.01 元' })
  @Column()
  price: number;

  @IsNotEmpty({ message: '请输入规格值' })
  @MaxLength(32, { message: '规格值最多 32 位' })
  @Column({ length: 32 })
  spec: string;

  @IsNotEmpty({ message: '请输入库存' })
  @IsNumber({}, { message: '库存格式错误' })
  @Min(1, { message: '库存最低为 1' })
  @Column()
  sock: number;

  @Column({name: 'product_id'})
  productId: string;

  @ApiModelProperty({ enum: [ENTITY_STATUS_ENUM.disable, ENTITY_STATUS_ENUM.enable] })
  @IsEnum(ENTITY_STATUS_ENUM, { message: '状态格式不正确' })
  @Column({ enum: ENTITY_STATUS_ENUM })
  status: ENTITY_STATUS_ENUM;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
