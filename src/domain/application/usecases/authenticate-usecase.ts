import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { UsersRepository } from '../repositories/users-repository';
import { HashComparer } from '../crypthograpy/hash-comparer';
import { Encrypter } from '../crypthograpy/encrypter';

type AuthenticateUseCaseRequestDTO = {
  email: string;
  password: string;
};

type AuthenticateUseCaseResponse = Either<
  ResourceNotFoundError,
  { access_token: string }
>;

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequestDTO): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return left(new ResourceNotFoundError());
    }

    const access_token = await this.encrypter.encrypty({ user_id: user.id });

    return right({ access_token });
  }
}
