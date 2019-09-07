import { createParamDecorator } from '@nestjs/common';
import { PeopleEntity } from './people.entity';

export type AutUserEntity = PeopleEntity;
export const AuthUser = createParamDecorator((data, req): AutUserEntity => {
  return req.user;
});
