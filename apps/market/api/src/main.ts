// Must be the first import: AppModule's @Module({...}) reads process.env at import time.
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: (process.env.CORS_ORIGINS ?? '').split(','),
    credentials: true,
  });
  await app.listen(4002);
}
bootstrap();
