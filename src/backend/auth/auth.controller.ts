import { Body, Controller, Post } from '@nestjs/common';
import { PeopleLoginDto } from '../people/people.entity';
import { ParamsException } from '../../shared/all-exception.exception';
import * as bcrypt from 'bcryptjs';
import { ApiUseTags } from '@nestjs/swagger';
import { BACKEND_JWT_ALGORITHM, ENTITY_STATUS_ENUM } from '../../shared/constant';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '../../config/config.service';
import { AuthService } from './auth.service';

@ApiUseTags('认证管理')
@Controller('backend/people')
export class AuthController {
  constructor(
    private authService: AuthService,
    public configService: ConfigService,
  ) {
  }

  @Post('/login')
  async login(@Body() authLoginDto: PeopleLoginDto) {
    const result = await this.authService.repository3.findOne({
      username: authLoginDto.username,
    }, {
      select: ['id', 'password', 'status'],
    });
    if (!result) {
      throw new ParamsException('用户名不存在');
    }
    if (!bcrypt.compareSync(authLoginDto.password, result.password)) {
      throw new ParamsException('密码错误');
    }
    if (result.status === ENTITY_STATUS_ENUM.disable) {
      throw new ParamsException('用户已锁定, 无法登陆');
    }

    return {
      token: await this.createToken(result.id),
    };
  }

  private async createToken(id: string) {
    const secretKey = this.configService.getString('BACKEND_TOKEN_SECRET_KEY');
    return new Promise((resolve, reject) => {
      jwt.sign({ id }, secretKey, { algorithm: BACKEND_JWT_ALGORITHM }, (error, token) => {
        if (error) {
          reject(new ParamsException('生成 token 错误'));
          return;
        }
        resolve(token);
      });

    });
  }
}
