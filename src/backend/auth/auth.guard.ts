import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PeopleService } from '../people/people.service';
import { ConfigService } from '../../config/config.service';
import * as jwt from 'jsonwebtoken';
import { PermissionNotFindException, TokenFindCasingException, TokenFindException, TokenVerifyException } from '../../shared/all-exception.exception';
import { BACKEND_JWT_ALGORITHM } from '../../shared/constant';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  peopleService: PeopleService;
  configService: ConfigService;
  reflector: Reflector;

  constructor(
    @Inject(PeopleService) peopleService: PeopleService,
    @Inject(ConfigService) configService: ConfigService,
    @Inject(Reflector) reflector: Reflector,
  ) {
    this.peopleService = peopleService;
    this.configService = configService;
    this.reflector = reflector;
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
    const secretKey = this.configService.getString('BACKEND_TOKEN_SECRET_KEY');

    return new Promise(async (resolve, reject) => {
      jwt.verify(token, secretKey, { algorithms: [BACKEND_JWT_ALGORITHM] }, (error, payload) => {
        if (error) {
          reject(new TokenVerifyException());
          return;
        }
        // 获得用户信息 并注入 req 对象
        this.peopleService.repository.findOne(payload.id).then(async result => {
          if (!result) {
            reject(new TokenFindException());
            return;
          }
          // 取得当前路由所需权限
          const permissions = this.reflector.get<string[]>('permission', context.getHandler());
          if (permissions) {
            // 从数据库获取拥有权限
            let permissionCodes = await this.peopleService.findPermissions(result.id);
            permissionCodes = permissionCodes.map(item => item.code);
            for (const per of permissions) {
              // 如果无权限
              if (!(permissionCodes as string[]).includes(per)) {
                reject(new PermissionNotFindException());
                return;
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
