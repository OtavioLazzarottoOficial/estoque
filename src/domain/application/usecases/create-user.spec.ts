import { UniqueEntityID } from '../../../core/entities/unique-entity-id';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { UsersInMemoryRepository } from 'test/in-memory/users-in-memory-repository';
import { CreateUserUseCase } from './create-user-usecase';
import { FakerEncrypter } from 'test/cryphograpy/faker-encrypter';
import { Roles, User } from '../../enterprise/entities/user';
import { EmailInvalidError } from '../../enterprise/entities/value-objects/errors/email-invalid-error';
import { makeUser } from 'test/factories/make-user';
import { EmailValueObject } from '../../enterprise/entities/value-objects/email-value-object';
import { ExistUserWithThisEmailError } from './errors/exist-user-with-this-email-error';
import { InvalidPasswordError } from '../../enterprise/entities/value-objects/errors/invalid-password-error';

let usersInMemoryRepository: UsersInMemoryRepository;
let encrypter: FakerEncrypter;
let sut: CreateUserUseCase;
describe('Create User Use Case', () => {
  beforeEach(() => {
    usersInMemoryRepository = new UsersInMemoryRepository();
    encrypter = new FakerEncrypter();
    sut = new CreateUserUseCase(usersInMemoryRepository, encrypter);
  });

  it('Should not be able create a user with email invalid.', async () => {
    const result = await sut.execute({
      email: 'invalid-email',
      name: 'John Doe',
      password: 'password123',
      role: Roles.ADMIN,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EmailInvalidError);
  });

  it('Should not be able create a user with email already in use.', async () => {
    const existingUser = makeUser({
      email: EmailValueObject.createFromBD('john.doe@example.com'),
    });

    usersInMemoryRepository.items.push(existingUser);

    const result = await sut.execute({
      email: 'john.doe@example.com',
      name: 'Jane Doe',
      password: 'password456',
      role: Roles.USER,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ExistUserWithThisEmailError);
  });

  it('Should not be able create a user with password that does not meet the requirements.', async () => {
    const result = await sut.execute({
      email: 'john.doe@example.com',
      name: 'Jane Doe',
      password: '123',
      role: Roles.USER,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidPasswordError);
  });

  it('Should be able create a user.', async () => {
    const result = await sut.execute({
      email: 'john.doe@example.com',
      name: 'Jane Doe',
      password: 'Password123!',
      role: Roles.USER,
    });

    expect(result.isRight()).toBe(true);

    expect(usersInMemoryRepository.items).toHaveLength(1);
  });
});
