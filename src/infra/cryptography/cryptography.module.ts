import { Module } from '@nestjs/common';
import { BcryptHasher } from './bcrypt-hasher';
import { HashComparer } from '../../domain/application/crypthograpy/hash-comparer';
import { HashGenerator } from '../../domain/application/crypthograpy/hash-generator';
import { Encrypter } from '../../domain/application/crypthograpy/encrypter';
import { JwtEncrypter } from './jwt-encrypter';

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashComparer,
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
