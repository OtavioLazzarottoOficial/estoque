import { PasswordValueObject } from '@/domain/enterprise/entities/value-objects/password-value-object';
import { FakerEncrypter } from '../../../../test/cryphograpy/faker-encrypter';
import { FakerJWT } from '../../../../test/cryphograpy/faker-jwt';
import { makeUser } from '../../../../test/factories/make-user';
import { UsersInMemoryRepository } from '../../../../test/in-memory/users-in-memory-repository';
import { AuthenticateUseCase } from './authenticate-usecase';

let usersInMemoryRepository: UsersInMemoryRepository;
let fakerJWT: FakerJWT;
let fakerEncrypter: FakerEncrypter;
let sut: AuthenticateUseCase;

describe('AuthenticateUseCase', () => {
  beforeEach(() => {
    usersInMemoryRepository = new UsersInMemoryRepository();
    fakerJWT = new FakerJWT();
    fakerEncrypter = new FakerEncrypter();
    sut = new AuthenticateUseCase(
      usersInMemoryRepository,
      fakerEncrypter,
      fakerJWT,
    );
  });

  it('Should be able to authenticate a user', async () => {
    const passwordHash = await fakerEncrypter.hash('@O17931793a');

    const user = makeUser({
      password: PasswordValueObject.createFromHash(passwordHash),
    });
    usersInMemoryRepository.items.push(user);

    const result = await sut.execute({
      email: user.email,
      password: '@O17931793a',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toHaveProperty('access_token');
    expect.any(String);
  });
});
