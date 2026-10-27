import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '../repositories/users-repository';
import { ImageUploader } from '../services/image-uploader';
import { User } from '@/domain/enterprise/entities/user';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

type DeleteUserAvatarUseCaseRequest = {
  userId: string;
};

type DeleteUserAvatarUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User;
  }
>;

@Injectable()
export class DeleteUserAvatarUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private imageUploader: ImageUploader,
  ) {}

  async execute({
    userId,
  }: DeleteUserAvatarUseCaseRequest): Promise<DeleteUserAvatarUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError('User not found'));
    }

    const removedAvatar = user.removeAvatar();

    await this.usersRepository.save(user);

    if (removedAvatar) {
      await this.imageUploader.discard([removedAvatar.storageKey]);
    }

    return right({ user });
  }
}
