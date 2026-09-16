export abstract class Encrypter {
  abstract encrypt(value: string): Promise<string>;
  abstract compare(value: string, hashedValue: string): Promise<boolean>;
}
