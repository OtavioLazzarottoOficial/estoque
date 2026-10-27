import { describe, it, expect, beforeEach } from 'vitest';
import { UploadProductImagesUseCase } from './upload-product-images-usecase';
import { ProductInMemoryRepository } from '../../../../test/in-memory/product-in-memory-repository';
import { ImageUploader } from '../services/image-uploader';
import { FakeFileStorage } from '../../../../test/storage/fake-file-storage';
import { makeProduct } from '../../../../test/factories/make-product';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { InvalidImageMimeTypeError } from '@/domain/enterprise/entities/value-objects/errors/invalid-image-mime-type.error';
import { MaxImagesExceededError } from '@/domain/enterprise/entities/errors/max-images-exceeded.error';
import { Product } from '@/domain/enterprise/entities/product';

let productsRepository: ProductInMemoryRepository;
let fileStorage: FakeFileStorage;
let imageUploader: ImageUploader;
let sut: UploadProductImagesUseCase;

function createProductHelper(): Product {
  const result = makeProduct();
  if (result.isLeft()) {
    throw new Error('Failed to create test product');
  }
  return result.value;
}

describe('Upload Product Images Use Case', () => {
  beforeEach(() => {
    productsRepository = new ProductInMemoryRepository();
    fileStorage = new FakeFileStorage();
    imageUploader = new ImageUploader(fileStorage);
    sut = new UploadProductImagesUseCase(productsRepository, imageUploader);
  });

  it('should upload images to an existing product', async () => {
    const product = createProductHelper();
    await productsRepository.create(product);

    const result = await sut.execute({
      productId: product.id.toString(),
      images: [
        {
          fileName: 'front.jpg',
          mimeType: 'image/jpeg',
          body: Buffer.from('front-bytes'),
        },
        {
          fileName: 'back.png',
          mimeType: 'image/png',
          body: Buffer.from('back-bytes'),
        },
      ],
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.product.images).toHaveLength(2);
      expect(fileStorage.uploads.size).toBe(2);
    }
  });

  it('should return error when product does not exist', async () => {
    const result = await sut.execute({
      productId: 'non-existing-id',
      images: [
        {
          fileName: 'front.jpg',
          mimeType: 'image/jpeg',
          body: Buffer.from('front-bytes'),
        },
      ],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(fileStorage.uploads.size).toBe(0);
  });

  it('should return error on invalid mime type without uploading', async () => {
    const product = createProductHelper();
    await productsRepository.create(product);

    const result = await sut.execute({
      productId: product.id.toString(),
      images: [
        {
          fileName: 'document.pdf',
          mimeType: 'application/pdf',
          body: Buffer.from('pdf-bytes'),
        },
      ],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidImageMimeTypeError);
    expect(fileStorage.uploads.size).toBe(0);
  });

  it('should return error when exceeding max images limit (10)', async () => {
    const product = createProductHelper();
    await productsRepository.create(product);

    const elevenImages = Array.from({ length: 11 }, (_, i) => ({
      fileName: `img-${i}.jpg`,
      mimeType: 'image/jpeg',
      body: Buffer.from(`img-${i}`),
    }));

    const result = await sut.execute({
      productId: product.id.toString(),
      images: elevenImages,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(MaxImagesExceededError);
    expect(fileStorage.uploads.size).toBe(0);
  });
});
