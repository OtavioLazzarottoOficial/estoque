import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from './app.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true, // ESSENCIAL
    }),
    AppModule,
  ],
})
export class AppModuleTest {}
