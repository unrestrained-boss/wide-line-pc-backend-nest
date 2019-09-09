import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, AfterLoad } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsArray, IsEmail, IsEnum, IsMobilePhone, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { ENTITY_STATUS_ENUM, PEOPLE_ROOT_ENUM } from '../../shared/constant';
import { ConfigService } from '../../config/config.service';

// 此处无法注入 configService
export class PeopleEntityWithoutPassword {
  avatarUrl: string;

  @AfterLoad()
  setComputed() {
    this.avatarUrl = ConfigService.urlPrefix + this.avatar;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiModelProperty()
  @MinLength(4, { message: '用户名至少需要 4 位' })
  @MaxLength(32, { message: '用户名最多需要 32 位' })
  @IsNotEmpty({ message: '用户名必须填写' })
  @Column({ length: 32 })
  username: string;

  @ApiModelPropertyOptional()
  @MinLength(4, { message: '真实姓名至少需要 4 位' })
  @MaxLength(32, { message: '真实姓名最多需要 32 位' })
  @IsOptional()
  @Column({ length: 32 })
  realName: string;

  @ApiModelPropertyOptional()
  @MaxLength(128, { message: '头像最多 128 位' })
  @Column({ length: 128 })
  @IsOptional()
  avatar: string;

  @ApiModelProperty()
  @IsMobilePhone('zh-CN', { message: '手机号码格式不正确' })
  @Column({ length: 32 })
  phone: string;

  @ApiModelProperty()
  @IsEmail({}, { message: '邮箱地址不正确' })
  @Column({ length: 32 })
  email: string;

  @ApiModelProperty({ enum: [ENTITY_STATUS_ENUM.disable, ENTITY_STATUS_ENUM.enable] })
  @IsEnum(ENTITY_STATUS_ENUM, { message: '状态格式不正确' })
  @Column({ enum: ENTITY_STATUS_ENUM })
  status: ENTITY_STATUS_ENUM;
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

  @Exclude()
  @Column({ length: 32 })
  token: string;

  @Column({ enum: PEOPLE_ROOT_ENUM })
  root: PEOPLE_ROOT_ENUM;
}

export class PeopleUpdateDto extends PeopleEntityWithoutPassword {
  @ApiModelProperty()
  @IsArray({ message: '角色必须填写' })
  roles: string[];
}

export class PeopleCreateDto extends PeopleEntityWithoutPassword {
  @ApiModelProperty()
  @MaxLength(32, { message: '密码最多需要 32 位' })
  @MinLength(4, { message: '密码至少需要 4 位' })
  @IsNotEmpty({ message: '密码必须填写' })
  password: string;

  @ApiModelProperty()
  @MaxLength(32, { message: '确认密码最多需要 32 位' })
  @MinLength(4, { message: '确认密码至少需要 4 位' })
  @IsNotEmpty({ message: '确认密码必须填写' })
  confirmPassword: string;

  @ApiModelProperty()
  @IsArray({ message: '角色必须填写' })
  roles: string[];
}

export class PeopleLoginDto {
  @ApiModelProperty()
  @MinLength(4, { message: '用户名至少需要 4 位' })
  @MaxLength(32, { message: '用户名最多需要 32 位' })
  @IsNotEmpty({ message: '用户名必须填写' })
  @Column({ length: 32 })
  username: string;

  @ApiModelProperty()
  @MinLength(4, { message: '密码至少需要 4 位' })
  @MaxLength(32, { message: '密码最多需要 32 位' })
  @IsNotEmpty({ message: '密码必须填写' })
  password: string;
}
