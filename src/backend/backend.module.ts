import { Module } from '@nestjs/common';
import { PeopleModule } from './people/people.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { UploadModule } from './upload/upload.module';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [PeopleModule, RoleModule, PermissionModule, UploadModule, BrandModule, CategoryModule],
})
export class BackendModule {}
