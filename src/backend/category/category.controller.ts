import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Permission } from '../auth/permission.decorator';
import { PERMISSION_TYPES } from '../../shared/constant';
import { Pagination, PaginationType } from '../../shared/pagination.decorator';
import { ParamsException } from '../../shared/all-exception.exception';
import { CategoryService } from './category.service';
import { CategoryEntity } from './category.entity';
import { defaultTransformLabelOption, transformLabel } from '../../shared/util';

@ApiUseTags('分类管理')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('backend/category')

export class CategoryController {
  constructor(private service: CategoryService) {
  }

  @Permission(PERMISSION_TYPES.CATEGORY_LIST.code)
  @Get('')
  async index(@Pagination() page: PaginationType) {
    const [result, total] = await this.service.repository.findAndCount(page);
    return {
      data: result,
      total,
    };
  }

  @Permission(PERMISSION_TYPES.CATEGORY_LIST.code)
  @Get('options')
  async options() {
    const result = await this.service.repository.find();
    return transformLabel(result, null, defaultTransformLabelOption);
  }

  @Permission(PERMISSION_TYPES.CATEGORY_CREATE.code)
  @Post('')
  async create(@Body() brandEntity: CategoryEntity) {
    return await this.service.repository.save(brandEntity);
  }

  @Permission(PERMISSION_TYPES.CATEGORY_UPDATE.code)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: CategoryEntity) {
    const record = await this.service.repository.findOne(id);
    if (!record) {
      throw new ParamsException('分类不存在');
    }
    return await this.service.repository.save(updateDto);
  }

  @Permission(PERMISSION_TYPES.CATEGORY_DELETE.code)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const record = await this.service.repository.findOne(id);
    if (!record) {
      throw new ParamsException('分类不存在');
    }
    await this.service.repository.remove(record);
    return null;
  }
}
