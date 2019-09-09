import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrandEntity } from './brand.entity';

@Injectable()
export class BrandService {

  constructor(
    @InjectRepository(BrandEntity)
    public repository: Repository<BrandEntity>,
  ) {
  }
}
