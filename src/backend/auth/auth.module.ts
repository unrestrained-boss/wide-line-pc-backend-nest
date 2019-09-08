import { Module } from '@nestjs/common';
import { PeopleModule } from '../people/people.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PeopleModule,
  ],
  controllers: [AuthController],
  exports: [
    PeopleModule,
  ],
})
export class AuthModule {}
