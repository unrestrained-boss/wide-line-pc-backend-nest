import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity({ name: 'permission' })
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiModelProperty()
  @IsNotEmpty({ message: '请输入权限名称' })
  @MaxLength(32, { message: '权限名称不能超过 32 位' })
  @Column({ length: 32 })
  name: string;

  @ApiModelProperty()
  @IsNotEmpty({message: '请输入权限描述'})
  @MaxLength(128, { message: '权限描述不能超过 128 位' })
  @Column({ length: 128 })
  description: string;

  @ApiModelProperty()
  @IsNotEmpty({message: '请输入权限代码'})
  @MaxLength(16, { message: '权限代码不能超过 16 位' })
  @Column({ length: 16 })
  code: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
