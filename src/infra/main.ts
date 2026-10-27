import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';
import helmet from 'helmet';
import { AllExceptionsFilter } from './http/filters/all-exceptions.filter';
import * as path from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const envService = app.get(EnvService);
  const corsOrigins = envService.get('CORS_ORIGINS');
  const storageLocalPath = envService.get('STORAGE_LOCAL_PATH');

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );

  app.enableCors({
    origin:
      corsOrigins === '*'
        ? true
        : corsOrigins.split(',').map((origin) => origin.trim()),
    credentials: true,
  });
  app.useGlobalFilters(new AllExceptionsFilter());

  // Arquivos locais só são servidos pelo próprio servidor no driver local.
  // No R2 as imagens são entregues pela URL pública do bucket.
  if (envService.get('STORAGE_DRIVER') === 'local' && storageLocalPath) {
    app.useStaticAssets(path.resolve(storageLocalPath), {
      prefix: '/uploads/',
    });
  }

  const port = envService.get('PORT');

  await app.listen(port);
}
void bootstrap();
