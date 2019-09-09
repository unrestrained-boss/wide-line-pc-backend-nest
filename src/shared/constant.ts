export const BACKEND_JWT_ALGORITHM = 'HS256';

interface PermissionType {
  [key: string]: {
    code: string;
    name: string;
    description: string;
  };
}

const PEOPLE_MODULE = '人员模块';
const ROLE_MODULE = '角色模块';
const PERMISSION_MODULE = '权限模块';
export const PERMISSION_TYPES: PermissionType = {
  // 人员模块
  PEOPLE_LIST: { code: 'PEOPLE_LIST', name: PEOPLE_MODULE, description: '查看人员列表' },
  PEOPLE_INFO: { code: 'PEOPLE_INFO', name: PEOPLE_MODULE, description: '查看人员详情' },
  PEOPLE_CREATE: { code: 'PEOPLE_CREATE', name: PEOPLE_MODULE, description: '创建人员' },
  PEOPLE_UPDATE: { code: 'PEOPLE_UPDATE', name: PEOPLE_MODULE, description: '更新人员信息' },
  PEOPLE_DELETE: { code: 'PEOPLE_DELETE', name: PEOPLE_MODULE, description: '删除人员' },
  // 权限模块
  PERMISSION_LIST: { code: 'PERMISSION_LIST', name: PERMISSION_MODULE, description: '查看权限列表' },
  PERMISSION_INFO: { code: 'PERMISSION_INFO', name: PERMISSION_MODULE, description: '查看权限详情' },
  PERMISSION_CREATE: { code: 'PERMISSION_CREATE', name: PERMISSION_MODULE, description: '创建权限' },
  PERMISSION_UPDATE: { code: 'PERMISSION_UPDATE', name: PERMISSION_MODULE, description: '更新权限信息' },
  PERMISSION_DELETE: { code: 'PERMISSION_DELETE', name: PERMISSION_MODULE, description: '删除权限' },
  // 角色模块
  ROLE_LIST: { code: 'ROLE_LIST', name: ROLE_MODULE, description: '查看角色列表' },
  ROLE_INFO: { code: 'ROLE_INFO', name: ROLE_MODULE, description: '查看角色详情' },
  ROLE_CREATE: { code: 'ROLE_CREATE', name: ROLE_MODULE, description: '创建角色' },
  ROLE_UPDATE: { code: 'ROLE_UPDATE', name: ROLE_MODULE, description: '更新角色信息' },
  ROLE_DELETE: { code: 'ROLE_DELETE', name: ROLE_MODULE, description: '删除角色' },
};

export enum ENTITY_STATUS_ENUM {
  disable = 0,
  enable = 1,
}
