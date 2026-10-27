import { describe, it, expect, beforeEach } from 'vitest';
import { ProductInMemoryRepository } from '../../../../test/in-memory/product-in-memory-repository';
import { CategoriesInMemoryRepository } from '../../../../test/in-memory/categories-in-memory-repository';
import { CreateProductUseCase } from './create-product-usecase';
import { UniqueEntityID } from '../../../core/entities/unique-entity-id';
import { Status } from '../../enterprise/entities/product';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { PriceCannotBeLessThanZeroError } from '../../enterprise/entities/errors/price-cannot-be-less-than-zero.error';
import { makeCategory } from '../../../../test/factories/make-category';
import { ImageUploader } from '../services/image-uploader';
import { FakeFileStorage } from '../../../../test/storage/fake-file-storage';
import { InvalidImageMimeTypeError } from '@/domain/enterprise/entities/value-objects/errors/invalid-image-mime-type.error';

let productInMemoryRepository: ProductInMemoryRepository;
let categoriesInMemoryRepository: CategoriesInMemoryRepository;
let fileStorage: FakeFileStorage;
let imageUploader: ImageUploader;
let sut: CreateProductUseCase;

describe('Create Product Use Case', () => {
  beforeEach(() => {
    productInMemoryRepository = new ProductInMemoryRepository();
    categoriesInMemoryRepository = new CategoriesInMemoryRepository();
    fileStorage = new FakeFileStorage();
    imageUploader = new ImageUploader(fileStorage);
    sut = new CreateProductUseCase(
      productInMemoryRepository,
      categoriesInMemoryRepository,
      imageUploader,
    );
  });

  it('Should not be able create a product with category invalid.', async () => {
    const category = makeCategory({}, new UniqueEntityID('cat-1'));

    categoriesInMemoryRepository.items.push(category);

    const result = await sut.execute({
      name: 'Teclado',
      categoryId: 'Cat-2',
      description: 'Teclado mecânico',
      price: 100,
      status: Status.ACTIVE,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('Should not be able create a product with price less than zero.', async () => {
    const category = makeCategory({}, new UniqueEntityID('cat-1'));

    categoriesInMemoryRepository.items.push(category);

    const result = await sut.execute({
      name: 'Teclado',
      categoryId: category.id.toString(),
      description: 'Teclado mecânico',
      price: -1,
      status: Status.ACTIVE,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(PriceCannotBeLessThanZeroError);
  });

  it('Should be able create a Product without images', async () => {
    const category = makeCategory({}, new UniqueEntityID('cat-1'));

    categoriesInMemoryRepository.items.push(category);

    const result = await sut.execute({
      name: 'Teclado',
      categoryId: category.id.toString(),
      description: 'Teclado mecânico',
      price: 100,
      status: Status.ACTIVE,
    });

    expect(result.isRight()).toBe(true);
    expect(productInMemoryRepository.items).toHaveLength(1);
    expect(productInMemoryRepository.items[0].images).toHaveLength(0);
    expect(fileStorage.uploads.size).toBe(0);
  });

  it('Should be able create a Product with images', async () => {
    const category = makeCategory({}, new UniqueEntityID('cat-1'));

    categoriesInMemoryRepository.items.push(category);

    const result = await sut.execute({
      name: 'Teclado Gamer',
      categoryId: category.id.toString(),
      description: 'Teclado RGB',
      price: 250,
      status: Status.ACTIVE,
      images: [
        {
          fileName: 'front.jpg',
          mimeType: 'image/jpeg',
          body: Buffer.from('front-bytes'),
        },
        {
          fileName: 'side.png',
          mimeType: 'image/png',
          body: Buffer.from('side-bytes'),
        },
      ],
    });

    expect(result.isRight()).toBe(true);
    expect(productInMemoryRepository.items).toHaveLength(1);
    expect(productInMemoryRepository.items[0].images).toHaveLength(2);
    expect(fileStorage.uploads.size).toBe(2);
  });

  it('Should reject creating product with invalid image mime type', async () => {
    const category = makeCategory({}, new UniqueEntityID('cat-1'));

    categoriesInMemoryRepository.items.push(category);

    const result = await sut.execute({
      name: 'Teclado Gamer',
      categoryId: category.id.toString(),
      description: 'Teclado RGB',
      price: 250,
      status: Status.ACTIVE,
      images: [
        {
          fileName: 'exec.exe',
          mimeType: 'application/x-msdownload',
          body: Buffer.from('malicious'),
        },
      ],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidImageMimeTypeError);
    expect(productInMemoryRepository.items).toHaveLength(0);
    expect(fileStorage.uploads.size).toBe(0);
  });
});
