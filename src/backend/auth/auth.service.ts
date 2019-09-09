import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MergePeopleRoleEntity } from './merge-people-role.entity';
import { MergeRolePermissionEntity } from './merge-role-permission.entity';
import { PeopleCreateDto, PeopleEntity, PeopleUpdateDto } from '../people/people.entity';
import { BACKEND_JWT_ALGORITHM, ENTITY_STATUS_ENUM, PEOPLE_ROOT_ENUM } from '../../shared/constant';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '../../config/config.service';
import * as bcrypt from 'bcryptjs';
import { CreateRoleDto, RoleEntity } from '../role/role.entity';

@Injectable()
export class AuthService {
  configService: ConfigService;

  constructor(
    @InjectRepository(MergePeopleRoleEntity)
    public repository1: Repository<MergePeopleRoleEntity>,
    @InjectRepository(MergeRolePermissionEntity)
    public repository2: Repository<MergeRolePermissionEntity>,
    @InjectRepository(PeopleEntity)
    public repository3: Repository<PeopleEntity>,
    configService: ConfigService,
  ) {
    this.configService = configService;
  }

  async updatePeopleToken(id: string, token: string) {
    return await this.repository3.update(id, { token });
  }

  async findPermissionCodesById(id: string) {
    // TODO: IN PERMISSION CODES
    return await this.repository3.query(`SELECT \`code\` FROM \`permission\` WHERE \`id\`
    IN (
    SELECT \`permission_id\` FROM \`merge_role_permission\` WHERE \`role_id\`
      IN (
        SELECT \`role_id\` FROM \`role\` WHERE \`id\` IN (
          SELECT \`role_id\` FROM \`merge_people_role\` WHERE \`people_id\` = ?
        ) AND \`status\` = ?
      )
    ) AND \`status\` = ?;`, [id, ENTITY_STATUS_ENUM.enable, ENTITY_STATUS_ENUM.enable]);
  }

  async verifyToken(token: string) {
    const secretKey = this.configService.getString('BACKEND_TOKEN_SECRET_KEY');
    return new Promise((resolve) => {
      jwt.verify(token, secretKey, { algorithms: [BACKEND_JWT_ALGORITHM] }, (error, payload) => {
        if (error) {
          resolve(null);
        }
        resolve(payload);
      });
    });
  }

  async createPeopleWithRoles(createDto: PeopleCreateDto) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(createDto.password, salt);
    const peopleEntity = new PeopleEntity();
    // 强制设为 非 ROOT 用户
    peopleEntity.root = PEOPLE_ROOT_ENUM.no;
    Object.assign(peopleEntity, createDto);
    if (!peopleEntity.avatar) {
      peopleEntity.avatar = this.configService.getString('BACKEND_DEFAULT_AVATAR');
    }
    peopleEntity.password = hash;
    // TODO: try / catch
    // 插入用户表
    await this.repository3.manager.transaction(async entityManager => {
      await entityManager.save<PeopleEntity>(peopleEntity);
      // 插入用户角色表
      await entityManager.save<MergePeopleRoleEntity[]>(createDto.roles.map(role => {
        const p = new MergePeopleRoleEntity();
        p.roleId = role;
        p.peopleId = peopleEntity.id;
        return p;
      }));
    });
    return peopleEntity;
  }

  async updatePeopleWithRoles(peopleEntity: PeopleEntity, updateDto: PeopleUpdateDto) {
    Object.assign(peopleEntity, updateDto);
    // 强制设为 非 ROOT 用户
    peopleEntity.root = PEOPLE_ROOT_ENUM.no;
    // TODO: try / catch
    await this.repository3.manager.transaction(async entityManager => {
      await entityManager.save<PeopleEntity>(peopleEntity);
      await entityManager.query('DELETE FROM `merge_people_role` WHERE `people_id` = ?', [peopleEntity.id]);
      await entityManager.save<MergePeopleRoleEntity[]>(updateDto.roles.map(role => {
        const p = new MergePeopleRoleEntity();
        p.roleId = role;
        p.peopleId = peopleEntity.id;
        return p;
      }));
    });
    return peopleEntity;
  }

  async deletePeopleWithRoles(id: string) {
    // TODO: try / catch
    await this.repository3.manager.transaction(async entityManager => {
      await entityManager.query('DELETE FROM `people` WHERE `id` = ?', [id]);
      await entityManager.query('DELETE FROM `merge_people_role` WHERE `people_id` = ?', [id]);
    });
  }

  async createRoleWithPermissions(createDto: CreateRoleDto) {
    // TODO: try / catch
    await this.repository3.manager.transaction(async entityManager => {
      const roleEntity = new RoleEntity();
      Object.assign(roleEntity, createDto);
      await entityManager.save<RoleEntity>(roleEntity);
      await entityManager.save<MergeRolePermissionEntity[]>(createDto.permissions.map(permission => {
        const p = new MergeRolePermissionEntity();
        p.permissionId = permission;
        p.roleId = roleEntity.id;
        return p;
      }));
    });
    return createDto;
  }

  async updateRoleWithPermissions(roleEntity: RoleEntity, updateDto: CreateRoleDto) {
    Object.assign(roleEntity, updateDto);
    // TODO: try / catch
    await this.repository3.manager.transaction(async entityManager => {
      await entityManager.save<RoleEntity>(roleEntity);
      await entityManager.query('DELETE FROM `merge_role_permission` WHERE `role_id` = ?', [roleEntity.id]);
      await entityManager.save<MergeRolePermissionEntity[]>(updateDto.permissions.map(permission => {
        const p = new MergeRolePermissionEntity();
        p.permissionId = permission;
        p.roleId = roleEntity.id;
        return p;
      }));
    });
    return roleEntity;
  }

  async deleteRoleWithPermissions(id: string) {
    // TODO: try / catch
    await this.repository3.manager.transaction(async entityManager => {
      await entityManager.query('DELETE FROM `role` WHERE `id` = ?', [id]);
      await entityManager.query('DELETE FROM `merge_people_role` WHERE `role_id` = ?', [id]);
      await entityManager.query('DELETE FROM `merge_role_permission` WHERE `role_id` = ?', [id]);
    });
  }
}
