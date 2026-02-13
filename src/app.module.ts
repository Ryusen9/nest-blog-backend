import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { TagModule } from './tag/tag.module';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import path from 'path';
import { AuthModule } from './auth_main/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DB_URL'),
        port: configService.get<number>('DB_PORT'),
        synchronize: true,
        autoLoadEntities: true,
        entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
        logging: true,
      }),
    }),
    UserModule,
    PostModule,
    TagModule,
    LikeModule,
    CommentModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
