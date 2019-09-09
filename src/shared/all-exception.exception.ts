import { HttpException, HttpStatus } from '@nestjs/common';

export class ParamsException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.OK);
  }
}

export class TokenVerifyException extends HttpException {
  constructor() {
    super('Token 格式无效, 请检查后再试', HttpStatus.OK);
  }
}

export class TokenExpiredException extends HttpException {
  constructor() {
    super('Token 已过期, 请检查后再试', HttpStatus.OK);
  }
}

export class TokenFindCasingException extends HttpException {
  constructor() {
    super('Token 查找异常, 请稍后再试', HttpStatus.OK);
  }
}
export class PermissionNotFindException extends HttpException {
  constructor() {
    super('无权操作', HttpStatus.OK);
  }
}
