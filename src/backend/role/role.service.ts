import { Injectable } from '@nestjs/common';
import { RoleEntity } from './role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(RoleEntity)
              public repository: Repository<RoleEntity>) {
  }
}
