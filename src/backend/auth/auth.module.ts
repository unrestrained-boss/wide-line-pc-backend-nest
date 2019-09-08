import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MergePeopleRoleEntity } from './merge-people-role.entity';
import { MergeRolePermissionEntity } from './merge-role-permission.entity';
import { PeopleEntity } from '../people/people.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [MergePeopleRoleEntity, MergeRolePermissionEntity, PeopleEntity],
    ),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
