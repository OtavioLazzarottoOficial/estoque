import { describe, it, expect, beforeEach } from 'vitest';
import { SetMainProductImageUseCase } from './set-main-product-image-usecase';
import { ProductInMemoryRepository } from '../../../../test/in-memory/product-in-memory-repository';
import { makeProduct } from '../../../../test/factories/make-product';
import { ProductImage } from '@/domain/enterprise/entities/product-image';
import { ImageFile } from '@/domain/enterprise/entities/value-objects/image-file';
import { ProductImageNotFoundError } from '@/domain/enterprise/entities/errors/product-image-not-found.error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Product } from '@/domain/enterprise/entities/product';

let productsRepository: ProductInMemoryRepository;
let sut: SetMainProductImageUseCase;

function createProductHelper(): Product {
  const result = makeProduct();
  if (result.isLeft()) {
    throw new Error('Failed to create test product');
  }
  return result.value;
}

describe('Set Main Product Image Use Case', () => {
  beforeEach(() => {
    productsRepository = new ProductInMemoryRepository();
    sut = new SetMainProductImageUseCase(productsRepository);
  });

  it('should move selected image to position 0 (main image)', async () => {
    const product = createProductHelper();
    const image1 = ProductImage.create({
      file: ImageFile.restore({
        storageKey: 'img-1.jpg',
        url: 'https://storage.test/img-1.jpg',
        originalName: 'img-1.jpg',
        mimeType: 'image/jpeg',
        size: 100,
      }),
    });
    const image2 = ProductImage.create({
      file: ImageFile.restore({
        storageKey: 'img-2.jpg',
        url: 'https://storage.test/img-2.jpg',
        originalName: 'img-2.jpg',
        mimeType: 'image/jpeg',
        size: 200,
      }),
    });

    product.addImages([image1, image2]);
    await productsRepository.create(product);

    expect(product.mainImage?.id.toString()).toBe(image1.id.toString());

    const result = await sut.execute({
      productId: product.id.toString(),
      imageId: image2.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.product.mainImage?.id.toString()).toBe(
        image2.id.toString(),
      );
      expect(result.value.product.images[0].id.toString()).toBe(
        image2.id.toString(),
      );
      expect(result.value.product.images[1].id.toString()).toBe(
        image1.id.toString(),
      );
    }
  });

  it('should return error when image does not exist', async () => {
    const product = createProductHelper();
    await productsRepository.create(product);

    const result = await sut.execute({
      productId: product.id.toString(),
      imageId: new UniqueEntityID().toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ProductImageNotFoundError);
  });

  it('should return error when product does not exist', async () => {
    const result = await sut.execute({
      productId: 'non-existing',
      imageId: 'img-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
