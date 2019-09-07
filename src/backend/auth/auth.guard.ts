import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PeopleService } from '../people/people.service';
import { ConfigService } from '../../config/config.service';
import * as jwt from 'jsonwebtoken';
import { TokenExpiredException, TokenFindCasingException, TokenFindException, TokenVerifyException } from '../../shared/all-exception.exception';

@Injectable()
export class AuthGuard implements CanActivate {
  peopleService: PeopleService;
  configService: ConfigService;

  constructor(
    @Inject(PeopleService) peopleService: PeopleService,
    @Inject(ConfigService) configService: ConfigService,
  ) {
    this.peopleService = peopleService;
    this.configService = configService;
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
      jwt.verify(token, secretKey, { algorithms: ['RS256'] }, (error, payload) => {
        if (error) {
          reject(new TokenVerifyException());
          return;
        }
        // 获得用户信息 并注入 req 对象
        this.peopleService.findUserByToken(token).then(result => {
          if (!result) {
            reject(new TokenFindException());
            return;
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
