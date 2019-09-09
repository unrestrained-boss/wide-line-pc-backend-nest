import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './shared/all-exception.filter';
import { ParamsException } from './shared/all-exception.exception';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.use('/static', express.static(join(__dirname, '../', 'public')));
  app.enableCors();
  app.useGlobalFilters(new AllExceptionFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors: ValidationError[]) => {
      const message = Object.values(errors[0].constraints)[0];
      throw new ParamsException(message);
    },
    whitelist: true,
  }));

  const options = new DocumentBuilder()
    .setTitle('接口文档')
    .setDescription('description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);

  await app.listen(3000);
}
bootstrap();
