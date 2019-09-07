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
    `status`     TINYINT  DEFAULT 0 COMMENT '用户状态: 0 可用 1 锁定',
    `created_at` DATETIME           DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB COMMENT ='人员表';

CREATE TABLE `role`
(
    `id`         VARCHAR(36) UNIQUE,
    `name`       VARCHAR(32)  NOT NULL COMMENT '名称',
    `description`       VARCHAR(128) NOT NULL COMMENT '描述',
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
    `created_at` DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB COMMENT ='权限表';

