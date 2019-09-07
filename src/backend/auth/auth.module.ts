import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PeopleModule } from '../people/people.module';

@Module({
  imports: [
    PeopleModule,
  ],
  providers: [],
  controllers: [AuthController],
})
export class AuthModule {}
