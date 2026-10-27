import { describe, it, expect, beforeEach } from 'vitest';
import { DeleteUserAvatarUseCase } from './delete-user-avatar-usecase';
import { UsersInMemoryRepository } from '../../../../test/in-memory/users-in-memory-repository';
import { ImageUploader } from '../services/image-uploader';
import { FakeFileStorage } from '../../../../test/storage/fake-file-storage';
import { makeUser } from '../../../../test/factories/make-user';
import { ImageFile } from '@/domain/enterprise/entities/value-objects/image-file';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let usersRepository: UsersInMemoryRepository;
let fileStorage: FakeFileStorage;
let imageUploader: ImageUploader;
let sut: DeleteUserAvatarUseCase;

describe('Delete User Avatar Use Case', () => {
  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository();
    fileStorage = new FakeFileStorage();
    imageUploader = new ImageUploader(fileStorage);
    sut = new DeleteUserAvatarUseCase(usersRepository, imageUploader);
  });

  it('should remove avatar and discard file from storage', async () => {
    const user = makeUser();
    user.changeAvatar(
      ImageFile.restore({
        storageKey: 'avatars/123/avatar.png',
        url: 'https://storage.test/avatars/123/avatar.png',
        originalName: 'avatar.png',
        mimeType: 'image/png',
        size: 500,
      }),
    );
    await usersRepository.create(user);
    await fileStorage.upload({
      storageKey: 'avatars/123/avatar.png',
      body: Buffer.from('bytes'),
      mimeType: 'image/png',
    });

    expect(fileStorage.uploads.size).toBe(1);

    const result = await sut.execute({
      userId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.user.avatar).toBeNull();
      expect(fileStorage.uploads.size).toBe(0);
    }
  });

  it('should return error when user does not exist', async () => {
    const result = await sut.execute({
      userId: 'non-existing',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
