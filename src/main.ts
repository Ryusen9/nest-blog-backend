import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://nest-blog-frontend.vercel.app/',
      'http://192.168.0.198:3000',
    ],
    credentials: true,
  });
  // Enable cookie parsing for refresh token httpOnly cookies.
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  const port = Number(process.env.MAIN_PORT ?? 3000);
  await app.listen(port);
}
bootstrap();
