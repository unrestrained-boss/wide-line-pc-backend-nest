DROP DATABASE IF EXISTS `wide-line`;
CREATE DATABASE `wide-line` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_croatian_ci;

USE `wide-line`;
CREATE TABLE `people`
(
    `id`         VARCHAR(36) UNIQUE,
    `username`   VARCHAR(32) UNIQUE NOT NULL COMMENT '用户名',
    `password`   VARCHAR(64)        NOT NULL COMMENT '姓名',
    `realName`   VARCHAR(32)        NOT NULL COMMENT '真名',
    `avatar`     VARCHAR(128)       NOT NULL COMMENT '头像',
    `phone`      VARCHAR(32)        NOT NULL COMMENT '手机号码',
    `email`      VARCHAR(64)        NOT NULL COMMENT '电子邮箱',
    `status`     TINYINT  DEFAULT 1 COMMENT '状态: 1 可用 0 禁用',
    `created_at` DATETIME           DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB COMMENT ='人员表';

CREATE TABLE `role`
(
    `id`         VARCHAR(36) UNIQUE,
    `name`       VARCHAR(32)  NOT NULL COMMENT '名称',
    `description`       VARCHAR(128) NOT NULL COMMENT '描述',
    `status`     TINYINT  DEFAULT 1 COMMENT '状态: 1 可用 0 禁用',
    `created_at` DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB COMMENT ='角色表';

CREATE TABLE `permission`
(
    `id`         VARCHAR(36) UNIQUE,
    `name`       VARCHAR(32)  NOT NULL COMMENT '名称',
    `description`       VARCHAR(128) NOT NULL COMMENT '描述',
    `code`       VARCHAR(32)  NOT NULL COMMENT '对应的接口匹配代码',
    `status`     TINYINT  DEFAULT 1 COMMENT '状态: 1 可用 0 禁用',
    `created_at` DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB COMMENT ='权限表';

CREATE TABLE `merge_people_role`
(
    `id`         VARCHAR(36) UNIQUE,
    `people_id`       VARCHAR(36)  NOT NULL COMMENT '用户 ID',
    `role_id`       VARCHAR(36)  NOT NULL COMMENT '角色 ID',
    `created_at` DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB COMMENT ='用户角色权限表';

CREATE TABLE `merge_role_permission`
(
    `id`         VARCHAR(36) UNIQUE,
    `role_id`       VARCHAR(36)  NOT NULL COMMENT '角色 ID',
    `permission_id`       VARCHAR(36)  NOT NULL COMMENT '权限 ID',
    `created_at` DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB COMMENT ='权限角色权限表';

# 插入用户数据
INSERT INTO `people` (`id`, `username`, `password`, `realName`, `avatar`, `phone`, `email`, `status`, `created_at`, `updated_at`)
VALUES('09871522-77a5-4655-96be-4e70e9f27491', 'admin', '$2a$10$3QIhmgE3UAi9/jwzMEcRueRgAEE0ddlI1mHoka9VfpaegHyK9f05i', '超级管理员', '/avatar.png', '13888888888', '1@qq.com', 1, NOW(), NOW());
INSERT INTO `people` (`id`, `username`, `password`, `realName`, `avatar`, `phone`, `email`, `status`, `created_at`, `updated_at`)
VALUES('09871522-77a5-4655-96be-4e70e9f27492', 'option1', '$2a$10$3QIhmgE3UAi9/jwzMEcRueRgAEE0ddlI1mHoka9VfpaegHyK9f05i', '操作员 1', '/avatar.png', '13888888888', '1@qq.com', 1, NOW(), NOW());

# 插入角色数据
INSERT INTO `role` (`id`, `name`, `description`, `status`, `created_at`, `updated_at`)
VALUES
('19871522-77a5-4655-96be-4e70e9f27491', '超级管理员', '这是超级管理员', 1, NOW(), NOW()),
('19871522-77a5-4655-96be-4e70e9f27492', '普通操作员', '这是普通操作员', 1, NOW(), NOW());


# 插入权限数据
INSERT INTO `permission` (`id`, `name`, `description`, `code`, `status`, `created_at`, `updated_at`)
VALUES
('29871522-77a5-4655-96be-4e70e9f27491', '人员模块', '查看人员列表', 'PEOPLE_LIST', 1, NOW(), NOW()),
('29871522-77a5-4655-96be-4e70e9f27492', '人员模块', '查看人员详情', 'PEOPLE_INFO', 1, NOW(), NOW()),
('29871522-77a5-4655-96be-4e70e9f27493', '人员模块', '添加人员', 'PEOPLE_CREATE', 1, NOW(), NOW()),
('29871522-77a5-4655-96be-4e70e9f27494', '人员模块', '修改人员', 'PEOPLE_UPDATE', 1, NOW(), NOW()),
('29871522-77a5-4655-96be-4e70e9f27495', '人员模块', '删除人员', 'PEOPLE_DELETE', 1, NOW(), NOW());

# 插入角色人员
INSERT INTO `merge_people_role` (`id`, `people_id`, `role_id`, `created_at`, `updated_at`)
VALUES
('39871522-77a5-4655-96be-4e70e9f27491', '09871522-77a5-4655-96be-4e70e9f27491', '19871522-77a5-4655-96be-4e70e9f27491', NOW(), NOW()),
('39871522-77a5-4655-96be-4e70e9f27492', '09871522-77a5-4655-96be-4e70e9f27492', '19871522-77a5-4655-96be-4e70e9f27492', NOW(), NOW());

# 插入角色权限
INSERT INTO `merge_role_permission` (`id`, `role_id`, `permission_id`, `created_at`, `updated_at`)
VALUES
('49871522-77a5-4655-96be-4e70e9f27491', '19871522-77a5-4655-96be-4e70e9f27491', '29871522-77a5-4655-96be-4e70e9f27491', NOW(), NOW()),
('49871522-77a5-4655-96be-4e70e9f27492', '19871522-77a5-4655-96be-4e70e9f27491', '29871522-77a5-4655-96be-4e70e9f27492', NOW(), NOW()),
('49871522-77a5-4655-96be-4e70e9f27493', '19871522-77a5-4655-96be-4e70e9f27491', '29871522-77a5-4655-96be-4e70e9f27493', NOW(), NOW()),
('49871522-77a5-4655-96be-4e70e9f27494', '19871522-77a5-4655-96be-4e70e9f27491', '29871522-77a5-4655-96be-4e70e9f27494', NOW(), NOW()),
('49871522-77a5-4655-96be-4e70e9f27495', '19871522-77a5-4655-96be-4e70e9f27491', '29871522-77a5-4655-96be-4e70e9f27495', NOW(), NOW()),
('49871522-77a5-4655-96be-4e70e9f27496', '19871522-77a5-4655-96be-4e70e9f27492', '29871522-77a5-4655-96be-4e70e9f27491', NOW(), NOW());
