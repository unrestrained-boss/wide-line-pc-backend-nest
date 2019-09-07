import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { ParamsException } from '../../shared/all-exception.exception';
import { PermissionEntity } from './permission.entity';

@ApiUseTags('权限管理')
@ApiBearerAuth()
@Controller('backend/permission')
export class PermissionController {

  constructor(private service: PermissionService) {
  }
  @Get('')
  async index() {
    return await this.service.repository.find();
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const record = await this.service.repository.findOne(id);
    if (!record) {
      throw new ParamsException('权限不存在');
    }
    return record;
  }

  @Post('')
  async create(@Body() createDto: PermissionEntity) {
    return await this.service.repository.save(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: PermissionEntity) {
    const record = await this.service.repository.findOne(id);
    if (!record) {
      throw new ParamsException('权限不存在');
    }
    return await this.service.repository.save(updateDto);
  }

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
