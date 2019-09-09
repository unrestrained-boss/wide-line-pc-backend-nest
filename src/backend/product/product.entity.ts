import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsEnum, IsUUID, IsNotEmpty, IsOptional, MaxLength, Min, IsNumber } from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { ENTITY_STATUS_ENUM } from '../../shared/constant';

@Entity({ name: 'product' })
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiModelProperty()
  @MaxLength(64, { message: '产品名称不能超过 32 位' })
  @IsNotEmpty({ message: '请输入产品名称' })
  @Column({ length: 64 })
  title: string;

  @Column()
  spec: string;

  @Column()
  sales: number;

  @Column({ name: 'lowest_price' })
  lowestPrice: string;

  @ApiModelPropertyOptional()
  @IsNotEmpty({ message: '请上传轮播图' })
  @Column()
  thumbs: string;

  @ApiModelPropertyOptional()
  @IsNotEmpty({ message: '请输入产品详情' })
  @Column()
  details: string;

  @ApiModelPropertyOptional()
  @IsUUID('4', { message: '品牌 Id 格式错误' })
  @IsNotEmpty({ message: '请选择品牌' })
  @Column({ name: 'brand_id' })
  brandId: string;

  @ApiModelPropertyOptional()
  @IsUUID('4', { message: '分类 Id 格式错误' })
  @IsNotEmpty({ message: '请选择分类' })
  @Column({ name: 'category_id' })
  categoryId: string;

  @ApiModelProperty({ enum: [ENTITY_STATUS_ENUM.disable, ENTITY_STATUS_ENUM.enable] })
  @IsEnum(ENTITY_STATUS_ENUM, { message: '状态格式不正确' })
  @Column({ enum: ENTITY_STATUS_ENUM })
  status: ENTITY_STATUS_ENUM;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
