import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';
import { Either, left, right } from '../../../core/either';
import { InvalidPasswordError } from '../../enterprise/entities/value-objects/errors/invalid-password-error';
import { EmailInvalidError } from '../../enterprise/entities/value-objects/errors/email-invalid-error';
import { Roles, User } from '../../enterprise/entities/user';
import { ExistUserWithThisEmailError } from './errors/exist-user-with-this-email-error';
import { EmailValueObject } from '../../enterprise/entities/value-objects/email-value-object';
import { PasswordValueObject } from '../../enterprise/entities/value-objects/password-value-object';
import { Encrypter } from '../crypthograpy/encrypter';

type CreateUserUseCaseRequestDTO = {
  name: string;
  email: string;
  password: string;
  role: Roles;
};

type CreateUserUseCaseResponse = Either<
  InvalidPasswordError | EmailInvalidError | ExistUserWithThisEmailError,
  {
    user: User;
  }
>;

@Injectable()
export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private encrypter: Encrypter,
  ) {}

  async execute({
    name,
    email,
    password,
    role,
  }: CreateUserUseCaseRequestDTO): Promise<CreateUserUseCaseResponse> {
    const emailOrError = EmailValueObject.create(email);

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    const existingUserWithThisEmail =
      await this.usersRepository.findByEmail(email);

    if (existingUserWithThisEmail) {
      return left(new ExistUserWithThisEmailError(email));
    }

    const passwordOrError = PasswordValueObject.create(password);

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    const passwordHash = await this.encrypter.encrypt(
      passwordOrError.value.value,
    );

    const user = User.create({
      name,
      email: emailOrError.value,
      password: PasswordValueObject.createFromHash(passwordHash),
      role,
    });

    await this.usersRepository.create(user);

    return right({ user });
  }
}
