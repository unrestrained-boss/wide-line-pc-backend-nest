import { Module } from '@nestjs/common';
import { PeopleModule } from './people/people.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [PeopleModule, RoleModule, PermissionModule],
})
export class BackendModule {}
