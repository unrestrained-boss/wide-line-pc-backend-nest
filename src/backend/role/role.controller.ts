import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, RoleEntity } from './role.entity';
import { ParamsException } from '../../shared/all-exception.exception';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { PERMISSION_TYPES } from '../../shared/constant';
import { Permission } from '../auth/permission.decorator';
import { AuthService } from '../auth/auth.service';
import { Pagination, PaginationType } from '../../shared/pagination.decorator';

@ApiUseTags('角色管理')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('backend/role')
export class RoleController {
  constructor(
    private service: RoleService,
    private authService: AuthService,
  ) {
  }

  @Permission(PERMISSION_TYPES.ROLE_LIST.code)
  @Get('')
  async index(@Pagination() page: PaginationType) {
    const [result, total] = await this.service.repository.findAndCount(page);
    return {
      data: result,
      total,
    };
  }

  @Permission(PERMISSION_TYPES.ROLE_INFO.code)
  @Get(':id')
  async detail(@Param('id') id: string) {
    const record = await this.service.repository.findOne(id);
    if (!record) {
      throw new ParamsException('角色不存在');
    }
    return record;
  }

  @Permission(PERMISSION_TYPES.ROLE_CREATE.code)
  @Post('')
  async create(@Body() createDto: CreateRoleDto) {
    return await this.authService.createRoleWithPermissions(createDto);
  }

  @Permission(PERMISSION_TYPES.ROLE_UPDATE.code)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: CreateRoleDto) {
    const record = await this.service.repository.findOne(id);
    if (!record) {
      throw new ParamsException('角色不存在');
    }
    return await this.authService.updateRoleWithPermissions(record, updateDto);
  }

  @Permission(PERMISSION_TYPES.ROLE_DELETE.code)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const record = await this.service.repository.findOne(id);
    if (!record) {
      throw new ParamsException('角色不存在');
    }
    await this.authService.deleteRoleWithPermissions(record.id);
    return null;
  }
}
