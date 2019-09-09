import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { ProductSkuEntity } from './product-sku.entity';
import { BrandEntity } from '../brand/brand.entity';
import { CategoryEntity } from '../category/category.entity';
import { ParamsException } from '../../shared/all-exception.exception';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    public repository: Repository<ProductEntity>,
  ) {
  }

  async createProductWithSKU(productEntity: ProductEntity, skus: ProductSkuEntity[]) {
    await this.repository.manager.transaction(async e => {
      const brandCount = await e.count<BrandEntity>(BrandEntity, { id: productEntity.brandId });
      if (brandCount === 0) {
        throw new ParamsException('品牌不存在');
      }
      const categoryCount = await e.count<CategoryEntity>(CategoryEntity, { id: productEntity.categoryId });
      if (categoryCount === 0) {
        throw new ParamsException('分类不存在');
      }
      await e.save<ProductEntity>(productEntity);
      skus = skus.map(item => {
        const sku = new ProductSkuEntity();
        sku.price = item.price;
        sku.spec = item.spec;
        sku.sock = item.sock;
        sku.productId = productEntity.id;
        return sku;
      });
      await e.save<ProductSkuEntity[]>(skus);
    });
    return productEntity;
  }

  async updateProductWithSKU(productEntity: ProductEntity, skus: ProductSkuEntity[]) {
    await this.repository.manager.transaction(async e => {
      const brandCount = await e.count<BrandEntity>(BrandEntity, { id: productEntity.brandId });
      if (brandCount === 0) {
        throw new ParamsException('品牌不存在');
      }
      const categoryCount = await e.count<CategoryEntity>(CategoryEntity, { id: productEntity.categoryId });
      if (categoryCount === 0) {
        throw new ParamsException('分类不存在');
      }
      await e.save<ProductEntity>(productEntity);
      await e.query('DELETE FROM `product_sku` WHERE `product_id` = ?', [productEntity.id]);
      skus = skus.map(item => {
        const sku = new ProductSkuEntity();
        sku.price = item.price;
        sku.spec = item.spec;
        sku.sock = item.sock;
        sku.productId = productEntity.id;
        return sku;
      });
      await e.save<ProductSkuEntity[]>(skus);
    });
    return productEntity;
  }
  async deleteProduct(id: string) {
    await this.repository.manager.transaction(async e => {
      await e.query('DELETE FROM `product` WHERE `id` = ?', [id]);
      await e.query('DELETE FROM `product_sku` WHERE `product_id` = ?', [id]);
    });
  }
}
