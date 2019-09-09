import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Permission } from '../auth/permission.decorator';
import { PERMISSION_TYPES } from '../../shared/constant';
import { Pagination, PaginationType } from '../../shared/pagination.decorator';
import { ProductService } from './product.service';
import { ProductCreateDto, ProductEntity } from './product.entity';
import { ParamsException } from '../../shared/all-exception.exception';

@ApiUseTags('产品管理')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('backend/product')
export class ProductController {

  constructor(
    private service: ProductService,
  ) {
  }

  @Permission(PERMISSION_TYPES.PRODUCT_LIST.code)
  @Get('')
  async index(@Pagination() page: PaginationType) {
    const [result, total] = await this.service.repository.findAndCount(page);
    return {
      data: result,
      total,
    };
  }
  @Permission(PERMISSION_TYPES.PRODUCT_INFO.code)
  @Get(':id')
  async detail(@Param('id') id: string) {
    const record = await this.service.repository.findOne(id, {
      relations: ['skus', 'brand', 'category'],
    });
    if (!record) {
      throw new ParamsException('产品不存在');
    }
    return record;
  }

  @Permission(PERMISSION_TYPES.PRODUCT_CREATE.code)
  @Post('')
  async create(@Body() createDto: ProductCreateDto) {
    createDto.skus.sort((a, b) => a.price - b.price);
    const productEntity: ProductEntity = new ProductEntity();
    productEntity.title = createDto.title;
    productEntity.thumbs = createDto.thumbs;
    productEntity.details = createDto.details;
    productEntity.sales = 0;
    productEntity.spec = createDto.spec;
    productEntity.lowestPrice = createDto.skus[0].price;
    productEntity.highestPrice = createDto.skus[createDto.skus.length - 1].price;
    productEntity.brandId = createDto.brandId;
    productEntity.categoryId = createDto.categoryId;
    productEntity.status = createDto.status;
    return await this.service.createProductWithSKU(productEntity, createDto.skus);
    // TODO: 创建和更新成功后 调用 detail 方法
  }

  @Permission(PERMISSION_TYPES.PRODUCT_UPDATE.code)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: ProductCreateDto) {
    const record = await this.service.repository.findOne(id);
    if (!record) {
      throw new ParamsException('产品不存在');
    }
    updateDto.skus.sort((a, b) => a.price - b.price);
    record.title = updateDto.title;
    record.thumbs = updateDto.thumbs;
    record.details = updateDto.details;
    record.spec = updateDto.spec;
    record.lowestPrice = updateDto.skus[0].price;
    record.highestPrice = updateDto.skus[updateDto.skus.length - 1].price;
    record.brandId = updateDto.brandId;
    record.categoryId = updateDto.categoryId;
    record.status = updateDto.status;
    return await this.service.updateProductWithSKU(record, updateDto.skus);
  }

  @Permission(PERMISSION_TYPES.PRODUCT_DELETE.code)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const record = await this.service.repository.findOne(id);
    if (!record) {
      throw new ParamsException('产品不存在');
    }
    await this.service.deleteProduct(id);
    return null;
  }
}
