import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { EnvModule } from '../env/env.module';
import { UsersRepository } from '../../domain/application/repositories/users-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';

@Module({
  imports: [EnvModule],
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [PrismaService, UsersRepository],
})
export class DatabaseModule {}
