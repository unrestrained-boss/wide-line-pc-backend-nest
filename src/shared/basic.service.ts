import { Repository } from 'typeorm';

export interface IBasicService<T> {
  repository: Repository<T>;
}
