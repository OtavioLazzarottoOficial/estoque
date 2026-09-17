import { describe } from 'vitest';
import { ProductInMemoryRepository } from '../../../../test/in-memory/product-in-memory-repository';
import { CategoriesInMemoryRepository } from '../../../../test/in-memory/categories-in-memory-repository';
import { CreateProductUseCase } from './create-product-usecase';
import { UniqueEntityID } from '../../../core/entities/unique-entity-id';
import { Status } from '../../enterprise/entities/product';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { makeCategory } from 'test/factories/make-category';
import { PriceCannotBeLessThanZeroError } from '../../enterprise/entities/errors/price-cannot-be-less-than-zero.error';

let productInMemoryRepository: ProductInMemoryRepository;
let categoriesInMemoryRepository: CategoriesInMemoryRepository;
let sut: CreateProductUseCase;
describe('Create Product Use Case', () => {
  beforeEach(() => {
    productInMemoryRepository = new ProductInMemoryRepository();
    categoriesInMemoryRepository = new CategoriesInMemoryRepository();
    sut = new CreateProductUseCase(
      productInMemoryRepository,
      categoriesInMemoryRepository,
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

  it('Should be able create a Product', async () => {
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
  });
});
