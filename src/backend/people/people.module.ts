import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleEntity } from './people.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature(
      [PeopleEntity],
    ),
  ],
  controllers: [PeopleController],
  providers: [PeopleService],
  exports: [],
})
export class PeopleModule {
}
