import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleEntity } from './role.entity';
import { ParamsException } from '../../shared/all-exception.exception';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { PERMISSION_CODES } from '../../shared/constant';
import { Permission } from '../auth/permission.decorator';

@ApiUseTags('角色管理')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('backend/role')
export class RoleController {
  constructor(private service: RoleService) {
  }

  @Permission(PERMISSION_CODES.ROLE_LIST)
  @Get('')
  async index() {
    return await this.service.repository.find();
  }

  @Permission(PERMISSION_CODES.ROLE_INFO)
  @Get(':id')
  async detail(@Param('id') id: string) {
    const record = await this.service.repository.findOne(id);
    if (!record) {
      throw new ParamsException('角色不存在');
    }
    return record;
  }

  @Permission(PERMISSION_CODES.ROLE_CREATE)
  @Post('')
  async create(@Body() createDto: RoleEntity) {
    return await this.service.repository.save(createDto);
  }

  @Permission(PERMISSION_CODES.ROLE_UPDATE)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: RoleEntity) {
    const record = await this.service.repository.findOne(id);
    if (!record) {
      throw new ParamsException('角色不存在');
    }
    return await this.service.repository.save(updateDto);
  }

  @Permission(PERMISSION_CODES.ROLE_DELETE)
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
