import { Controller, Post } from '@nestjs/common';
import { Connection } from 'typeorm';
import { ConfigService } from './config/config.service';
import * as uuid from 'uuid';
import * as bcrypt from 'bcryptjs';
import { PERMISSION_TYPES } from './shared/constant';
import { ParamsException } from './shared/all-exception.exception';

@Controller('setup')
export class AppController {
  constructor(
    private connection: Connection,
    private configService: ConfigService,
  ) {
  }

  @Post()
  async setup() {
    const admin = {
      username: 'admin',
      password: '123123',
      realName: '超级管理员',
      avatar: 'uploads/default-backend-avatar.jpg',
      phone: '13989898989',
      email: 'admin@' + this.configService.getString('SERVER_HOST'),
    };
    const adminUUID = uuid();
    const roleUUID = uuid();
    const salt = bcrypt.genSaltSync(10);
    admin.password = bcrypt.hashSync(admin.password, salt);
    const permissions = Object.keys(PERMISSION_TYPES).map(key => {
      const item = PERMISSION_TYPES[key];
      return {
        id: uuid(),
        name: item.name,
        description: item.description,
        code: item.code,
      };
    });
    try {
      await this.connection.transaction(async e => {
        const result = await e.query('SELECT `id` FROM `people` WHERE `root` = ?', [1]);
        if (result.length > 0) {
          throw new ParamsException('root 用户已存在');
        }
        await e.query('DELETE FROM `people`');
        await e.query('DELETE FROM `role`');
        await e.query('DELETE FROM `permission`');
        await e.query('DELETE FROM `merge_people_role`');
        await e.query('DELETE FROM `merge_role_permission`');
        // 插入人员数据
        await e.query(
          'INSERT INTO `people` (`id`, `username`, `password`, `realName`, `avatar`, `phone`, `email`, `root`) VALUES(?, ?, ?, ?, ?, ?, ?, ?);',
          [adminUUID, admin.username, admin.password, admin.realName, admin.avatar, admin.phone, admin.email, 1],
        );
        // 插入角色数据
        // await e.query(
        //   'INSERT INTO `role` (`id`, `name`, `description`, `status`) VALUES(?, ?, ?, ?);',
        //   [roleUUID, '超级管理员', '至高无上', 1],
        // );
        // 插入人员角色中间表数据
        // await e.query(
        //   'INSERT INTO `merge_people_role` (`id`, `people_id`, `role_id`) VALUES(?, ?, ?);',
        //   [uuid(), adminUUID, roleUUID],
        // );

        for (const permission of permissions) {
          // 插入权限数据
          await e.query(
            'INSERT INTO `permission` (`id`, `code`, `name`, `description`) VALUES (?, ?, ?, ?);',
            [permission.id, permission.code, permission.name, permission.description],
          );
          // 插入角色权限中间数据
          // await e.query(
          //   'INSERT INTO `merge_role_permission` (`id`, `role_id`, `permission_id`) VALUES (?, ?, ?);',
          //   [uuid(), roleUUID, permission.id],
          // );
        }

      });
      return 'ok';
    } catch (e) {
      return e.message;
    }
  }
}
