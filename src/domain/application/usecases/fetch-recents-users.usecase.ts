import { Either, right } from '@/core/either';
import { User } from '@/domain/enterprise/entities/user';
import { UsersRepository } from '../repositories/users-repository';
import { Injectable } from '@nestjs/common';

type FetchRecentsUsersUseCaseRequest = {
  page: number;
};

type FetchRecentsUsersUseCaseResponse = Either<null, { users: User[] }>;

@Injectable()
export class FetchRecentsUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    page,
  }: FetchRecentsUsersUseCaseRequest): Promise<FetchRecentsUsersUseCaseResponse> {
    const users = await this.usersRepository.findManyRecent({ page });
    return right({ users });
  }
}
