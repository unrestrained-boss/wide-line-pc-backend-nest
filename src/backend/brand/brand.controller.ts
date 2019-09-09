import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { BrandService } from './brand.service';
import { Pagination, PaginationType } from '../../shared/pagination.decorator';
import { Permission } from '../auth/permission.decorator';
import { PERMISSION_TYPES } from '../../shared/constant';
import { BrandEntity } from './brand.entity';
import { ParamsException } from '../../shared/all-exception.exception';
import { defaultTransformLabelOption, transformLabel } from '../../shared/util';

@ApiUseTags('品牌管理')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('backend/brand')
export class BrandController {
  constructor(private service: BrandService) {
  }

  @Permission(PERMISSION_TYPES.BRAND_LIST.code)
  @Get('')
  async index(@Pagination() page: PaginationType) {
    const [result, total] = await this.service.repository.findAndCount(page);
    return {
      data: result,
      total,
    };
  }

  @Permission(PERMISSION_TYPES.BRAND_LIST.code)
  @Get('options')
  async options() {
    const result = await this.service.repository.find();
    return transformLabel(result, null, defaultTransformLabelOption);
  }

  @Permission(PERMISSION_TYPES.BRAND_CREATE.code)
  @Post('')
  async create(@Body() brandEntity: BrandEntity) {
    if (!brandEntity.story) {
      brandEntity.story = '';
    }
    return await this.service.repository.save(brandEntity);
  }

  @Permission(PERMISSION_TYPES.BRAND_UPDATE.code)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: BrandEntity) {
    const record = await this.service.repository.findOne(id);
    if (!record) {
      throw new ParamsException('品牌不存在');
    }
    if (!updateDto.story) {
      updateDto.story = '';
    }
    return await this.service.repository.save(updateDto);
  }

  @Permission(PERMISSION_TYPES.BRAND_DELETE.code)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const record = await this.service.repository.findOne(id);
    if (!record) {
      throw new ParamsException('品牌不存在');
    }
    await this.service.repository.remove(record);
    return null;
  }
}
//
// function dd(items: any[], id: string | null) {
//   const result: any[] = [];
//   for (const item of items) {
//     if (item.pid === id) {
//       item.children = dd(items, item.id);
//       result.push(item);
//     }
//   }
//   return result;
// }
