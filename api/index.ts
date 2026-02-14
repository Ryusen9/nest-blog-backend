import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import express from 'express';
import { AppModule } from '../src/app.module';

const expressApp = express();
let nestInitPromise: Promise<void> | null = null;

async function ensureNestApp(): Promise<void> {
  if (!nestInitPromise) {
    nestInitPromise = (async () => {
      const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp),
      );
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          transform: true,
        }),
      );
      await app.init();
    })();
  }

  await nestInitPromise;
}

export default async function handler(
  req: Request,
  res: Response,
): Promise<void> {
  await ensureNestApp();
  expressApp(req, res);
}
