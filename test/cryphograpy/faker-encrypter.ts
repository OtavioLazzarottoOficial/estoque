import { HashComparer } from '../../src/domain/application/crypthograpy/hash-comparer';
import { HashGenerator } from '../../src/domain/application/crypthograpy/hash-generator';

export class FakerEncrypter implements HashGenerator, HashComparer {
  async hash(value: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return `hashed-${value}`;
  }

  async compare(value: string, hashedValue: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return hashedValue === `hashed-${value}`;
  }
}
