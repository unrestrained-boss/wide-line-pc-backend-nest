import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import {
  IsEnum,
  IsUUID,
  IsNotEmpty,
  MaxLength,
  IsArray,
  ValidatorConstraint,
  ValidationArguments,
  ValidatorConstraintInterface, Validate, validateSync,
} from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { ENTITY_STATUS_ENUM } from '../../shared/constant';
import { ProductSkuEntity } from './product-sku.entity';

@ValidatorConstraint({ name: 'customText', async: false })
class IsSKUS implements ValidatorConstraintInterface {
  defaultMessage(validationArguments?: ValidationArguments): string {
    return '($value) 不是 SKU';
  }

  validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
    if (!Array.isArray(value)) {
      return false;
    }
    if (value.length === 0) {
      return false;
    }
    for (const item of value) {
      const p: ProductSkuEntity = new ProductSkuEntity();
      p.price = item.price;
      p.spec = item.spec;
      p.sock = item.sock;
      p.status = item.status;
      if (validateSync(p).length > 0) {
        return false;
      }
    }
    return true;
  }
}

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
  @IsNotEmpty({ message: '请输入规格名称' })
  @Column({ length: 32 })
  spec: string;

  @Column()
  sales: number;

  @Column({ name: 'lowest_price' })
  lowestPrice: number;

  @Column({ name: 'highest_price' })
  highestPrice: number;

  @ApiModelPropertyOptional()
  @IsNotEmpty({ message: '请上传轮播图' })
  @Column()
  thumbs: string;

  // TODO: IsString 注解
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

export class ProductCreateDto extends ProductEntity {
  @ApiModelPropertyOptional()
  @IsArray({ message: 'sku 格式不正确' })
  @Validate(IsSKUS, { message: 'sku 格式不正确' })
  skus: ProductSkuEntity[];
}
