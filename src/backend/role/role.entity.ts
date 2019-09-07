import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity({ name: 'role' })
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiModelProperty()
  @IsNotEmpty({ message: '请输入角色名称' })
  @MaxLength(32, { message: '角色名称不能超过 32 位' })
  @Column({ length: 32 })
  name: string;

  @ApiModelProperty()
  @IsNotEmpty({message: '请输入角色描述'})
  @MaxLength(128, { message: '描述不能超过 128 位' })
  @Column({ length: 128 })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
