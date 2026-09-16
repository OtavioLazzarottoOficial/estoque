import { Encrypter } from '../../src/domain/application/crypthograpy/encrypter';

export class FakerEncrypter implements Encrypter {
  async encrypt(value: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return `hashed-${value}`;
  }

  async compare(value: string, hashedValue: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return hashedValue === `hashed-${value}`;
  }
}
