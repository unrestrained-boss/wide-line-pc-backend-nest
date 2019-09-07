import { Module } from '@nestjs/common';
import { BackendModule } from './backend/backend.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.getString('DATABASE_HOST'),
          port: configService.getNumber('DATABASE_PORT'),
          username: configService.getString('DATABASE_USER'),
          password: configService.getString('DATABASE_PASS'),
          database: configService.getString('DATABASE_NAME'),
          logging: true,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
        };
      },
    }),
    BackendModule,
    ConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
