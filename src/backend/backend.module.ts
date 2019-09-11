import { Module } from '@nestjs/common';
import { PeopleModule } from './people/people.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { UploadModule } from './upload/upload.module';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [PeopleModule, RoleModule, PermissionModule, UploadModule, BrandModule, CategoryModule, ProductModule, OrderModule],
})
export class BackendModule {}
