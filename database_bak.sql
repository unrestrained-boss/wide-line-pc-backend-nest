DROP DATABASE IF EXISTS `wide-line`;
CREATE DATABASE `wide-line` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_croatian_ci;

USE `wide-line`;
CREATE TABLE `people`
(
    `id`         VARCHAR(36) UNIQUE,
    `username`   VARCHAR(32) UNIQUE NOT NULL COMMENT '用户名',
    `password`   VARCHAR(64)        NOT NULL COMMENT '密码',
    `realName`   VARCHAR(32)        NOT NULL COMMENT '真名',
    `avatar`     VARCHAR(128)       NOT NULL COMMENT '头像',
    `phone`      VARCHAR(32)        NOT NULL COMMENT '手机号码',
    `email`      VARCHAR(64)        NOT NULL COMMENT '电子邮箱',
    `token`      VARCHAR(255)        DEFAULT NULL COMMENT 'TOKEN',
    `root`       TINYINT  DEFAULT 0 COMMENT '是否是超级管理员, 无视权限: 1 是 0 否',
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
--
--CREATE TABLE `user`
--(
--    `id`         VARCHAR(36) UNIQUE,
--    `username`   VARCHAR(32) UNIQUE NOT NULL COMMENT '用户名',
--    `password`   VARCHAR(64)        NOT NULL COMMENT '姓名',
--    `nickname`   VARCHAR(64)        NOT NULL COMMENT '昵称',
--    `avatar`     VARCHAR(128)       NOT NULL COMMENT '头像',
--    `phone`      VARCHAR(32)        NOT NULL COMMENT '手机号码',
--    `email`      VARCHAR(64)        NOT NULL COMMENT '电子邮箱',
--    `token`      VARCHAR(255)        DEFAULT NULL COMMENT 'TOKEN',
--    `status`     TINYINT  DEFAULT 1 COMMENT '状态: 1 可用 0 禁用',
--    `created_at` DATETIME           DEFAULT CURRENT_TIMESTAMP,
--    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--    PRIMARY KEY (`id`)
--) ENGINE = InnoDB COMMENT ='用户表';
--
--CREATE TABLE `user_address`
--(
--    `id`         VARCHAR(36) UNIQUE,
--    `contact`    VARCHAR(32)  NOT NULL COMMENT '联系人',
--    `phone`      VARCHAR(32)        NOT NULL COMMENT '手机号码',
--    `province`   VARCHAR(32)        NOT NULL COMMENT '省份',
--    `city`       VARCHAR(32)        NOT NULL COMMENT '城市',
--    `area`       VARCHAR(32)        NOT NULL COMMENT '区域',
--    `address`    VARCHAR(255)       NOT NULL COMMENT '详细地址',
--    `is_default` TINYINT  DEFAULT 0 COMMENT '是否是默认地址: 1 是 0 否',
--    `created_at` DATETIME           DEFAULT CURRENT_TIMESTAMP,
--    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--    PRIMARY KEY (`id`)
--) ENGINE = InnoDB COMMENT ='用户地址表';

CREATE TABLE `brand`
(
    `id`         VARCHAR(36)  UNIQUE,
    `name`       VARCHAR(36)  NOT NULL COMMENT '品牌名称',
    `logo`       VARCHAR(128)  DEFAULT NULL COMMENT '品牌logo',
    `story`      TEXT NOT NULL COMMENT '品牌故事',
    `pid`        VARCHAR(36)  NOT NULL COMMENT '品牌上级 ID',
    `sort`       INT  DEFAULT 0 COMMENT '排序',
    `status`     TINYINT  DEFAULT 1 COMMENT '状态: 1 可用 0 禁用',
    `created_at` DATETIME           DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB COMMENT ='品牌表';

CREATE TABLE `category`
(
    `id`         VARCHAR(36)  UNIQUE,
    `name`       VARCHAR(36)  NOT NULL COMMENT '分类名称',
    `logo`       VARCHAR(128)  DEFAULT NULL COMMENT '分类logo',
    `pid`        VARCHAR(36)  NOT NULL COMMENT '分类上级 ID',
    `sort`       INT  DEFAULT 0 COMMENT '排序',
    `status`     TINYINT  DEFAULT 1 COMMENT '状态: 1 可用 0 禁用',
    `created_at` DATETIME           DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB COMMENT ='分类表';

--CREATE TABLE `product`
--(
--    `id`         VARCHAR(36)  UNIQUE,
--    `title`      VARCHAR(64)  NOT NULL COMMENT '产品名称',
--    `spec`       VARCHAR(32)  NOT NULL COMMENT '规范:如尺码, 内存',
--    `thumbs`     TEXT       NOT NULL COMMENT '轮播图',
--    `details`    TEXT       NOT NULL COMMENT '详情',
--    `sales`      INT        DEFAULT 0 COMMENT '销量',
--    `brand_id`      VARCHAR(36)       NOT NULL COMMENT '品牌 ID',
--    `category_id`   VARCHAR(36)       NOT NULL COMMENT '类别 ID',
--    `status`     TINYINT  DEFAULT 1 COMMENT '状态: 1 可用 0 禁用',
--    `created_at` DATETIME           DEFAULT CURRENT_TIMESTAMP,
--    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--    PRIMARY KEY (`id`)
--) ENGINE = InnoDB COMMENT ='产品表';
