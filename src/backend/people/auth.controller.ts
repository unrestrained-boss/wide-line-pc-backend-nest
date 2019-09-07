import { Body, Controller, Post } from '@nestjs/common';
import { PeopleLoginDto } from './people.entity';
import { ParamsException } from '../../shared/all-exception.exception';
import { PeopleService } from './people.service';
import * as bcrypt from 'bcryptjs';
import { ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('认证管理')
@Controller('backend/people')
export class AuthController {
  constructor(
    private service: PeopleService,
  ) {
  }

  @Post('/login')
  async login(@Body() authLoginDto: PeopleLoginDto) {
    const result = await this.service.repository.findOne({
      username: authLoginDto.username,
    }, {
      select: ['id', 'password'],
    });
    if (!result) {
      throw new ParamsException('用户名不存在');
    }
    if (!bcrypt.compareSync(authLoginDto.password, result.password)) {
      throw new ParamsException('密码错误');
    }

    return {
      token: await this.service.createToken(result.id),
    };
  }
}
