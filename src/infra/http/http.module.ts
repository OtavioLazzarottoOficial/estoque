import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { CreateUserController } from './controllers/create-user.controller';
import { CreateUserUseCase } from '../../domain/application/usecases/create-user-usecase';
import { GetUserController } from './controllers/get-user.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateUserController, GetUserController],
  providers: [CreateUserUseCase],
})
export class HttpModule {}
