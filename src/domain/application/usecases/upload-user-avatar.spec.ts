import { describe, it, expect, beforeEach } from 'vitest';
import { UploadUserAvatarUseCase } from './upload-user-avatar-usecase';
import { UsersInMemoryRepository } from '../../../../test/in-memory/users-in-memory-repository';
import { ImageUploader } from '../services/image-uploader';
import { FakeFileStorage } from '../../../../test/storage/fake-file-storage';
import { makeUser } from '../../../../test/factories/make-user';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { ImageTooLargeError } from '@/domain/enterprise/entities/value-objects/errors/image-too-large.error';

let usersRepository: UsersInMemoryRepository;
let fileStorage: FakeFileStorage;
let imageUploader: ImageUploader;
let sut: UploadUserAvatarUseCase;

describe('Upload User Avatar Use Case', () => {
  beforeEach(() => {
    usersRepository = new UsersInMemoryRepository();
    fileStorage = new FakeFileStorage();
    imageUploader = new ImageUploader(fileStorage);
    sut = new UploadUserAvatarUseCase(usersRepository, imageUploader);
  });

  it('should upload user avatar successfully', async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const result = await sut.execute({
      userId: user.id.toString(),
      file: {
        fileName: 'avatar.png',
        mimeType: 'image/png',
        body: Buffer.from('avatar-bytes'),
      },
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.user.avatar).not.toBeNull();
      expect(result.value.user.avatar?.originalName).toBe('avatar.png');
      expect(fileStorage.uploads.size).toBe(1);
    }
  });

  it('should replace avatar and discard previous one from storage', async () => {
    const user = makeUser();
    await usersRepository.create(user);

    // 1st avatar
    await sut.execute({
      userId: user.id.toString(),
      file: {
        fileName: 'first.png',
        mimeType: 'image/png',
        body: Buffer.from('first-bytes'),
      },
    });

    const firstStorageKey = user.avatar?.storageKey;
    expect(fileStorage.uploads.size).toBe(1);

    // 2nd avatar (replace)
    const result = await sut.execute({
      userId: user.id.toString(),
      file: {
        fileName: 'second.jpg',
        mimeType: 'image/jpeg',
        body: Buffer.from('second-bytes'),
      },
    });

    expect(result.isRight()).toBe(true);
    expect(fileStorage.uploads.size).toBe(1);
    expect(fileStorage.uploads.has(firstStorageKey!)).toBe(false);
  });

  it('should reject avatar larger than 2MB', async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const result = await sut.execute({
      userId: user.id.toString(),
      file: {
        fileName: 'huge.jpg',
        mimeType: 'image/jpeg',
        body: Buffer.alloc(3 * 1024 * 1024), // 3MB
      },
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ImageTooLargeError);
    expect(fileStorage.uploads.size).toBe(0);
  });

  it('should return error when user does not exist', async () => {
    const result = await sut.execute({
      userId: 'non-existing',
      file: {
        fileName: 'avatar.jpg',
        mimeType: 'image/jpeg',
        body: Buffer.from('avatar-bytes'),
      },
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
