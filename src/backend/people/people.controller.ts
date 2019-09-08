import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleCreateDto, PeopleEntity } from './people.entity';
import { ParamsException } from '../../shared/all-exception.exception';
import * as bcrypt from 'bcryptjs';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { AuthUser, AutUserEntity } from '../auth/auth.decorator';
import { Permission } from '../auth/permission.decorator';
import { PERMISSION_CODES } from '../../shared/constant';

@ApiUseTags('用户管理')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('backend/people')
export class PeopleController {

  constructor(
    private service: PeopleService,
  ) {
  }

  @Permission(PERMISSION_CODES.PEOPLE_LIST)
  @Get('')
  async index(@AuthUser() user: AutUserEntity) {
    return await this.service.repository.find();
  }

  @Permission(PERMISSION_CODES.PEOPLE_INFO)
  @Get(':id')
  async detail(@Param('id') id: string) {
    const record = await this.service.repository.findOne(id);
    if (!record) {
      throw new ParamsException('用户不存在');
    }
    return record;
  }

  @Permission(PERMISSION_CODES.PEOPLE_CREATE)
  @Post('')
  async create(@Body() createDto: PeopleCreateDto) {
    if (createDto.password !== createDto.confirmPassword) {
      throw new ParamsException('两次密码输入不一致');
    }
    delete createDto.confirmPassword;
    const record = await this.service.repository.findOne({ username: createDto.username }, { select: ['id'] });
    if (record) {
      throw new ParamsException('用户名已存在');
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(createDto.password, salt);
    const peopleEntity = new PeopleEntity();
    Object.assign(peopleEntity, createDto);
    peopleEntity.password = hash;
    await this.service.repository.save(peopleEntity);
    return peopleEntity;
  }

  @Permission(PERMISSION_CODES.PEOPLE_UPDATE)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: PeopleEntity) {
    const record = await this.service.repository.findOne(id);
    if (!record) {
      throw new ParamsException('用户不存在');
    }
    Object.assign(record, updateDto);
    await this.service.repository.save(record);
    return record;
  }

  @Permission(PERMISSION_CODES.PEOPLE_DELETE)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const record = await this.service.repository.findOne(id);
    if (!record) {
      throw new ParamsException('用户不存在');
    }
    await this.service.repository.remove(record);
    return null;
  }
}
