import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Entity({ name: 'merge_role_permission' })
export class MergeRolePermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'role_id', length: 36 })
  roleId: string;

  @Column({ name: 'permission_id', length: 36 })
  permissionId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
@Injectable()
export class MergeRolePermissionService {
  constructor(@InjectRepository(MergeRolePermissionEntity)
              public repository: Repository<MergeRolePermissionEntity>) {
  }
}
