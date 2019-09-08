import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsEnum, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { ENTITY_STATUS_ENUM } from '../../shared/constant';

@Entity({ name: 'permission' })
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiModelProperty()
  @MaxLength(32, { message: '权限名称不能超过 32 位' })
  @IsNotEmpty({ message: '请输入权限名称' })
  @Column({ length: 32 })
  name: string;

  @ApiModelProperty()
  @MaxLength(128, { message: '权限描述不能超过 128 位' })
  @IsNotEmpty({ message: '请输入权限描述' })
  @Column({ length: 128 })
  description: string;

  @ApiModelProperty({ enum: [ENTITY_STATUS_ENUM.disable, ENTITY_STATUS_ENUM.enable] })
  @IsEnum(ENTITY_STATUS_ENUM, { message: '状态格式不正确' })
  @Column({ enum: ENTITY_STATUS_ENUM })
  status: ENTITY_STATUS_ENUM;

  @ApiModelProperty()
  @MaxLength(16, { message: '权限代码不能超过 16 位' })
  @IsNotEmpty({ message: '请输入权限代码' })
  @Column({ length: 16 })
  code: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
