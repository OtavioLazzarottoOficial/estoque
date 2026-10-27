import { describe, it, expect, beforeEach } from 'vitest';
import { ImageUploader } from './image-uploader';
import { FakeFileStorage } from '../../../../test/storage/fake-file-storage';
import { PRODUCT_IMAGE_POLICY } from '@/domain/enterprise/entities/value-objects/image-policies';
import { InvalidImageMimeTypeError } from '@/domain/enterprise/entities/value-objects/errors/invalid-image-mime-type.error';
import { ImageTooLargeError } from '@/domain/enterprise/entities/value-objects/errors/image-too-large.error';

let fileStorage: FakeFileStorage;
let sut: ImageUploader;

describe('Image Uploader Service', () => {
  beforeEach(() => {
    fileStorage = new FakeFileStorage();
    sut = new ImageUploader(fileStorage);
  });

  it('should prepare valid images correctly', () => {
    const result = sut.prepare(
      [
        {
          fileName: 'foto.jpg',
          mimeType: 'image/jpeg',
          body: Buffer.from('fake-image-bytes'),
        },
      ],
      {
        folder: 'products/123',
        policy: PRODUCT_IMAGE_POLICY,
      },
    );

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toHaveLength(1);
      expect(result.value[0].file.storageKey).toMatch(
        /^products\/123\/[a-f0-9-]+\.jpg$/,
      );
      expect(result.value[0].file.url).toBe(
        `https://storage.test/${result.value[0].file.storageKey}`,
      );
      expect(result.value[0].file.originalName).toBe('foto.jpg');
      expect(result.value[0].file.mimeType).toBe('image/jpeg');
      expect(result.value[0].file.size).toBe(
        Buffer.from('fake-image-bytes').byteLength,
      );
    }
  });

  it('should reject unsupported mime type', () => {
    const result = sut.prepare(
      [
        {
          fileName: 'document.pdf',
          mimeType: 'application/pdf',
          body: Buffer.from('pdf-bytes'),
        },
      ],
      {
        folder: 'products/123',
        policy: PRODUCT_IMAGE_POLICY,
      },
    );

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidImageMimeTypeError);
  });

  it('should reject file exceeding max size', () => {
    const largeBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB (policy is 5MB)

    const result = sut.prepare(
      [
        {
          fileName: 'big.png',
          mimeType: 'image/png',
          body: largeBuffer,
        },
      ],
      {
        folder: 'products/123',
        policy: PRODUCT_IMAGE_POLICY,
      },
    );

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ImageTooLargeError);
  });

  it('should upload files and discard on failure', async () => {
    const prepareResult = sut.prepare(
      [
        {
          fileName: 'img1.png',
          mimeType: 'image/png',
          body: Buffer.from('img1'),
        },
      ],
      {
        folder: 'products/123',
        policy: PRODUCT_IMAGE_POLICY,
      },
    );

    expect(prepareResult.isRight()).toBe(true);
    if (prepareResult.isRight()) {
      await sut.upload(prepareResult.value);
      expect(fileStorage.uploads.size).toBe(1);

      await sut.discard(prepareResult.value.map((p) => p.file.storageKey));
      expect(fileStorage.uploads.size).toBe(0);
    }
  });
});
