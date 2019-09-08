import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsArray, IsEnum, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { ENTITY_STATUS_ENUM } from '../../shared/constant';

@Entity({ name: 'role' })
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiModelProperty()
  @MaxLength(32, { message: '角色名称不能超过 32 位' })
  @IsNotEmpty({ message: '请输入角色名称' })
  @Column({ length: 32 })
  name: string;

  @ApiModelProperty()
  @MaxLength(128, { message: '描述不能超过 128 位' })
  @IsNotEmpty({ message: '请输入角色描述' })
  @Column({ length: 128 })
  description: string;

  @ApiModelProperty({ enum: [ENTITY_STATUS_ENUM.disable, ENTITY_STATUS_ENUM.enable] })
  @IsEnum(ENTITY_STATUS_ENUM, { message: '状态格式不正确' })
  @Column({ enum: ENTITY_STATUS_ENUM })
  status: ENTITY_STATUS_ENUM;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export class CreateRoleDto extends RoleEntity {
  @ApiModelProperty()
  @IsArray({ message: '权限必须填写' })
  permissions: string[];
}
