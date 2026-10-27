import { describe, it, expect, beforeEach } from 'vitest';
import { DeleteProductImageUseCase } from './delete-product-image-usecase';
import { ProductInMemoryRepository } from '../../../../test/in-memory/product-in-memory-repository';
import { ImageUploader } from '../services/image-uploader';
import { FakeFileStorage } from '../../../../test/storage/fake-file-storage';
import { makeProduct } from '../../../../test/factories/make-product';
import { ProductImage } from '@/domain/enterprise/entities/product-image';
import { ImageFile } from '@/domain/enterprise/entities/value-objects/image-file';
import { ProductImageNotFoundError } from '@/domain/enterprise/entities/errors/product-image-not-found.error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Product } from '@/domain/enterprise/entities/product';

let productsRepository: ProductInMemoryRepository;
let fileStorage: FakeFileStorage;
let imageUploader: ImageUploader;
let sut: DeleteProductImageUseCase;

function createProductHelper(): Product {
  const result = makeProduct();
  if (result.isLeft()) {
    throw new Error('Failed to create test product');
  }
  return result.value;
}

describe('Delete Product Image Use Case', () => {
  beforeEach(() => {
    productsRepository = new ProductInMemoryRepository();
    fileStorage = new FakeFileStorage();
    imageUploader = new ImageUploader(fileStorage);
    sut = new DeleteProductImageUseCase(productsRepository, imageUploader);
  });

  it('should remove image from product and delete from storage', async () => {
    const product = createProductHelper();
    const image = ProductImage.create({
      file: ImageFile.restore({
        storageKey: 'products/123/img.jpg',
        url: 'https://storage.test/products/123/img.jpg',
        originalName: 'img.jpg',
        mimeType: 'image/jpeg',
        size: 100,
      }),
    });

    product.addImages([image]);
    await productsRepository.create(product);
    await fileStorage.upload({
      storageKey: 'products/123/img.jpg',
      body: Buffer.from('img'),
      mimeType: 'image/jpeg',
    });

    expect(fileStorage.uploads.size).toBe(1);

    const result = await sut.execute({
      productId: product.id.toString(),
      imageId: image.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.product.images).toHaveLength(0);
      expect(fileStorage.uploads.size).toBe(0);
    }
  });

  it('should return error when product does not exist', async () => {
    const result = await sut.execute({
      productId: 'non-existing',
      imageId: 'img-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should return error when image does not exist on product', async () => {
    const product = createProductHelper();
    await productsRepository.create(product);

    const result = await sut.execute({
      productId: product.id.toString(),
      imageId: new UniqueEntityID().toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ProductImageNotFoundError);
  });
});
