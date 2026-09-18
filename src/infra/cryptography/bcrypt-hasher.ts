import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { HashGenerator } from '../../domain/application/crypthograpy/hash-generator';
import { HashComparer } from '../../domain/application/crypthograpy/hash-comparer';

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8;

  async hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH);
  }
  async compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
}
