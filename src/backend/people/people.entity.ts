import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsEmail, IsEnum, IsMobilePhone, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export enum PeopleStatusEnum {
  disable = 0,
  enable = 1,
}

export class PeopleEntityWithoutPassword {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiModelProperty()
  @IsNotEmpty({ message: '用户名必须填写' })
  @MinLength(4, { message: '用户名至少需要 4 位' })
  @MaxLength(32, { message: '用户名最多需要 32 位' })
  @Column({ length: 32 })
  username: string;

  @ApiModelPropertyOptional()
  @IsOptional()
  @MinLength(4, { message: '真实姓名至少需要 4 位' })
  @MaxLength(32, { message: '真实姓名最多需要 32 位' })
  @Column({ length: 32 })
  realName: string;

  @ApiModelPropertyOptional()
  @IsOptional()
  @MaxLength(128, { message: '头像最多 128 位' })
  @Column({ length: 128 })
  avatar: string = '/avatar.png';

  @ApiModelProperty()
  @IsMobilePhone('zh-CN', { message: '手机号码格式不正确' })
  @Column({ length: 32 })
  phone: string;

  @ApiModelProperty()
  @IsEmail({}, { message: '邮箱地址不正确' })
  @Column({ length: 32 })
  email: string;

  @ApiModelProperty({enum: [PeopleStatusEnum.disable, PeopleStatusEnum.enable]})
  @IsEnum(PeopleStatusEnum, { message: '状态格式不正确' })
  @Column({ enum: PeopleStatusEnum })
  status: PeopleStatusEnum;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Entity({ name: 'people' })
export class PeopleEntity extends PeopleEntityWithoutPassword {
  @Exclude()
  @Column({ length: 64 })
  password: string;
}

export class PeopleCreateDto extends PeopleEntityWithoutPassword {
  @ApiModelProperty()
  @IsNotEmpty({ message: '密码必须填写' })
  @MinLength(4, { message: '密码至少需要 4 位' })
  @MaxLength(32, { message: '密码最多需要 32 位' })
  password: string;

  @ApiModelProperty()
  @IsNotEmpty({ message: '确认密码必须填写' })
  @MinLength(4, { message: '确认密码至少需要 4 位' })
  @MaxLength(32, { message: '确认密码最多需要 32 位' })
  confirmPassword: string;
}
