import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleCreateDto, PeopleUpdateDto } from './people.entity';
import { ParamsException } from '../../shared/all-exception.exception';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { AuthUser, AutUserEntity } from '../auth/auth.decorator';
import { Permission } from '../auth/permission.decorator';
import { PEOPLE_ROOT_ENUM, PERMISSION_TYPES } from '../../shared/constant';
import { AuthService } from '../auth/auth.service';

@ApiUseTags('用户管理')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('backend/people')
export class PeopleController {

  constructor(
    private service: PeopleService,
    private authService: AuthService,
  ) {
  }

  @Permission(PERMISSION_TYPES.PEOPLE_LIST.code)
  @Get('')
  async index(@AuthUser() user: AutUserEntity) {
    return await this.service.repository.find();
  }

  @Permission(PERMISSION_TYPES.PEOPLE_INFO.code)
  @Get(':id')
  async detail(@Param('id') id: string) {
    const record = await this.service.repository.findOne(id);
    if (!record) {
      throw new ParamsException('用户不存在');
    }
    return record;
  }

  @Permission(PERMISSION_TYPES.PEOPLE_CREATE.code)
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
    return await this.authService.createPeopleWithRoles(createDto);
  }

  @Permission(PERMISSION_TYPES.PEOPLE_UPDATE.code)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: PeopleUpdateDto) {
    const record = await this.service.repository.findOne(id);
    if (!record) {
      throw new ParamsException('用户不存在');
    }
    if (record.root === PEOPLE_ROOT_ENUM.yes) {
      throw new ParamsException('无法修改 root 用户');
    }
    return await this.authService.updatePeopleWithRoles(record, updateDto);
  }

  @Permission(PERMISSION_TYPES.PEOPLE_DELETE.code)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const record = await this.service.repository.findOne(id);
    if (!record) {
      throw new ParamsException('用户不存在');
    }
    if (record.root === PEOPLE_ROOT_ENUM.yes) {
      throw new ParamsException('无法删除 root 用户');
    }
    await this.authService.deletePeopleWithRoles(id);
    return null;
  }
}
