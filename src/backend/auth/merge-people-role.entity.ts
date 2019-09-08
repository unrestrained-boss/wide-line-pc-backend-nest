import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Entity({ name: 'merge_people_role' })
export class MergePeopleRoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'role_id', length: 36 })
  roleId: string;

  @Column({ name: 'people_id', length: 36 })
  peopleId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Injectable()
export class MergePeopleRoleService {
  constructor(@InjectRepository(MergePeopleRoleEntity)
              public repository: Repository<MergePeopleRoleEntity>) {
  }
}
