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
    `token`      VARCHAR(255)        DEFAULT NULL COMMENT 'TOKEN',
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
