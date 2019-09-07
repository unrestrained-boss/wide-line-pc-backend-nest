import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleEntity } from './people.entity';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [PeopleEntity],
    ),
  ],
  controllers: [PeopleController, AuthController],
  providers: [PeopleService],
  exports: [PeopleService],
})
export class PeopleModule {
}
