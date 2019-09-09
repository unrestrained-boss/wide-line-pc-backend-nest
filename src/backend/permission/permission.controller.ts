import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { ParamsException } from '../../shared/all-exception.exception';
import { PermissionEntity } from './permission.entity';
import { Permission } from '../auth/permission.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { PERMISSION_TYPES } from '../../shared/constant';

@ApiUseTags('权限管理')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('backend/permission')
export class PermissionController {

  constructor(private service: PermissionService) {
  }
  @Permission(PERMISSION_TYPES.PERMISSION_LIST.code)
  @Get('')
  async index() {
    return await this.service.repository.find();
  }

  @Permission(PERMISSION_TYPES.PERMISSION_INFO.code)
  @Get(':id')
  async detail(@Param('id') id: string) {
    const record = await this.service.repository.findOne(id);
    if (!record) {
      throw new ParamsException('权限不存在');
    }
    return record;
  }

  @Permission(PERMISSION_TYPES.PERMISSION_CREATE.code)
  @Post('')
  async create(@Body() createDto: PermissionEntity) {
    return await this.service.repository.save(createDto);
  }

  @Permission(PERMISSION_TYPES.PERMISSION_UPDATE.code)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: PermissionEntity) {
    const record = await this.service.repository.findOne(id);
    if (!record) {
      throw new ParamsException('权限不存在');
    }
    return await this.service.repository.save(updateDto);
  }

  @Permission(PERMISSION_TYPES.PERMISSION_DELETE.code)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const record = await this.service.repository.findOne(id);
    if (!record) {
      throw new ParamsException('权限不存在');
    }
    await this.service.repository.remove(record);
    return null;
  }
}
