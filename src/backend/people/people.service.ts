import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PeopleEntity } from './people.entity';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '../../config/config.service';
import { BACKEND_JWT_ALGORITHM } from '../../shared/constant';
import { ParamsException } from '../../shared/all-exception.exception';

@Injectable()
export class PeopleService {

  constructor(
    @InjectRepository(PeopleEntity)
    public repository: Repository<PeopleEntity>,
    public configService: ConfigService,
  ) {
  }

  async findUserByToken(token: string) {
    return await this.repository.findOne();
  }

  async createToken(id: string) {
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
