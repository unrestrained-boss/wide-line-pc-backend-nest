import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PeopleEntity } from './people.entity';

@Injectable()
export class PeopleService {

  constructor(
    @InjectRepository(PeopleEntity)
    public repository: Repository<PeopleEntity>,
  ) {
  }
}
