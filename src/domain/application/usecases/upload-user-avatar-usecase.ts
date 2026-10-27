import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '../repositories/users-repository';
import { ImageInput, ImageUploader } from '../services/image-uploader';
import { User } from '@/domain/enterprise/entities/user';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { USER_AVATAR_POLICY } from '@/domain/enterprise/entities/value-objects/image-policies';
import { InvalidImageMimeTypeError } from '@/domain/enterprise/entities/value-objects/errors/invalid-image-mime-type.error';
import { ImageTooLargeError } from '@/domain/enterprise/entities/value-objects/errors/image-too-large.error';

type UploadUserAvatarUseCaseRequest = {
  userId: string;
  file: ImageInput;
};

type UploadUserAvatarUseCaseResponse = Either<
  ResourceNotFoundError | InvalidImageMimeTypeError | ImageTooLargeError,
  {
    user: User;
  }
>;

@Injectable()
export class UploadUserAvatarUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private imageUploader: ImageUploader,
  ) {}

  async execute({
    userId,
    file,
  }: UploadUserAvatarUseCaseRequest): Promise<UploadUserAvatarUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError('User not found'));
    }

    const preparedOrError = this.imageUploader.prepare([file], {
      folder: `avatars/${user.id.toString()}`,
      policy: USER_AVATAR_POLICY,
    });

    if (preparedOrError.isLeft()) {
      return left(preparedOrError.value);
    }

    const [prepared] = preparedOrError.value;
    const previousAvatar = user.changeAvatar(prepared.file);

    await this.imageUploader.upload([prepared]);

    try {
      await this.usersRepository.save(user);
    } catch (error) {
      await this.imageUploader.discard([prepared.file.storageKey]);
      throw error;
    }

    if (previousAvatar) {
      await this.imageUploader.discard([previousAvatar.storageKey]);
    }

    return right({ user });
  }
}
