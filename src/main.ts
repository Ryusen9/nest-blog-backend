import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://nest-blog-frontend.vercel.app',
      'https://nest-blog-frontend-jade.vercel.app',
      'http://192.168.0.198:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
  const config = new DocumentBuilder()
    .setTitle('Nest Blog API')
    .setDescription(
      'HTTP API for the Nest Blog application. Request bodies are validated and unknown fields are stripped. Send the access token as Authorization: Bearer <access_token>. Login and refresh set an httpOnly refresh_token cookie; send that cookie to POST /auth/refresh and POST /auth/logout. Realtime messages use Socket.IO (client event newMessage, server event onMessage) and are not HTTP routes.',
    )
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description:
        'JWT access token returned by POST /auth/login or POST /auth/refresh.',
    })
    .addCookieAuth('refresh_token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'refresh_token',
      description:
        'httpOnly cookie set by login and replaced on each refresh. Required by POST /auth/refresh.',
    })
    .addTag('App', 'Welcome message')
    .addTag('Auth', 'Login, current user, refresh, and logout')
    .addTag('User', 'User accounts')
    .addTag('Post', 'Blog posts')
    .addTag('Comment', 'Comments')
    .addTag('Like', 'Likes')
    .addTag('Tag', 'Tags')
    .addTag('File Upload', 'Image uploads to Cloudinary')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory(), {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  const port = Number(process.env.PORT ?? process.env.MAIN_PORT ?? 3000);
  await app.listen(port, '0.0.0.0'); // listen on all interfaces
}
void bootstrap();
