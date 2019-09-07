import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleEntity } from './role.entity';
import { ParamsException } from '../../shared/all-exception.exception';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('角色管理')
@ApiBearerAuth()
@Controller('backend/role')
export class RoleController {
  constructor(private service: RoleService) {
  }

  @Get('')
  async index() {
    return await this.service.repository.find();
  }
  
  @Get(':id')
  async detail(@Param('id') id: string) {
    const record = await this.service.repository.findOne(id);
    if (!record) {
      throw new ParamsException('角色不存在');
    }
    return record;
  }

  @Post('')
  async create(@Body() createDto: RoleEntity) {
    return await this.service.repository.save(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: RoleEntity) {
    const record = await this.service.repository.findOne(id);
    if (!record) {
      throw new ParamsException('角色不存在');
    }
    return await this.service.repository.save(updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const record = await this.service.repository.findOne(id);
    if (!record) {
      throw new ParamsException('角色不存在');
    }
    await this.service.repository.remove(record);
    return null;
  }
}
