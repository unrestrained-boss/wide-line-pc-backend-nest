import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsArray, IsEnum, IsUUID, IsNotEmpty, IsOptional, MaxLength, Min, IsNumber } from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { ENTITY_STATUS_ENUM } from '../../shared/constant';

@Entity({ name: 'category' })
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiModelProperty()
  @MaxLength(32, { message: '分类名称不能超过 32 位' })
  @IsNotEmpty({ message: '请输入分类名称' })
  @Column({ length: 32 })
  name: string;

  @ApiModelPropertyOptional()
  @MaxLength(128, { message: 'logo最多 128 位' })
  @Column({ length: 128 })
  @IsOptional()
  logo: string;

  @ApiModelPropertyOptional()
  @Column()
  @IsUUID('4', {message: '上级分类格式不正确'})
  @IsOptional()
  pid: string | null;

  @ApiModelPropertyOptional()
  @Column()
  @IsNumber({}, {message: '排序必须是数字'})
  @IsOptional()
  sort: number;

  @ApiModelProperty({ enum: [ENTITY_STATUS_ENUM.disable, ENTITY_STATUS_ENUM.enable] })
  @IsEnum(ENTITY_STATUS_ENUM, { message: '状态格式不正确' })
  @Column({ enum: ENTITY_STATUS_ENUM })
  status: ENTITY_STATUS_ENUM;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
