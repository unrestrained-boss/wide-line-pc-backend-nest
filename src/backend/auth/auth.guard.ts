import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '../../config/config.service';
import {
  ParamsException,
  PermissionNotFindException,
  TokenExpiredException,
  TokenFindCasingException,
  TokenVerifyException,
} from '../../shared/all-exception.exception';
import { ENTITY_STATUS_ENUM, PEOPLE_ROOT_ENUM } from '../../shared/constant';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  configService: ConfigService;
  reflector: Reflector;
  authService: AuthService;

  constructor(
    @Inject(ConfigService) configService: ConfigService,
    @Inject(Reflector) reflector: Reflector,
    @Inject(AuthService) authService: AuthService,
  ) {
    this.configService = configService;
    this.reflector = reflector;
    this.authService = authService;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    // 依次从 headers query body 中获取 token
    const token = AuthGuard.parserToken(req);
    if (!token) {
      throw new UnauthorizedException('未携带 Token, 请检查后再试');
    }
    // const secretKey = this.configService.getString('BACKEND_TOKEN_SECRET_KEY');

    return new Promise(async (resolve, reject) => {
      this.authService.verifyToken(token).then((payload: any) => {
        if (!payload) {
          reject(new TokenVerifyException());
          return;
        }
        // 获得用户信息 并注入 req 对象
        this.authService.repository3.findOne(payload.id).then(async result => {
          if (!result) {
            reject(new ParamsException('当前用户不存在'));
            return;
          }
          if (result.status === ENTITY_STATUS_ENUM.disable) {
            reject(new ParamsException('用户已被禁用, 无法继续'));
            return;
          }
          if (token !== result.token) {
            reject(new TokenExpiredException());
            return;
          }
          // ROOT 用户直接拥有权限
          if (result.root === PEOPLE_ROOT_ENUM.no) {
            // 取得当前路由所需权限
            const permissions = this.reflector.get<string[]>('permission', context.getHandler());
            if (permissions) {
              // 从数据库获取拥有权限
              let permissionCodes = await this.authService.findPermissionCodesById(result.id);
              permissionCodes = permissionCodes.map(item => item.code);
              for (const per of permissions) {
                // 如果无权限
                if (!(permissionCodes as string[]).includes(per)) {
                  reject(new PermissionNotFindException());
                  return;
                }
              }
            }
          }

          req.user = result;
          resolve(true);
        })
          .catch(() => {
            reject(new TokenFindCasingException());
          });
      });
    });
  }

  private static parserToken(req: any): string | undefined {
    if (req.headers.authorization) {
      const authorization: string = req.headers.authorization;
      const splitAuthorization = authorization.split(' ');
      return splitAuthorization[1];
    }
    return req.query.token || req.body.token;
  }
}
