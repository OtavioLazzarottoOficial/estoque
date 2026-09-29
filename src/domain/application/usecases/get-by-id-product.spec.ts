import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeProduct } from '../../../../test/factories/make-product';
import { ProductInMemoryRepository } from '../../../../test/in-memory/product-in-memory-repository';
import { GetByIdProductUseCase } from './get-by-id-product-usecase';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let inMemoryProductsRepository: ProductInMemoryRepository;
let sut: GetByIdProductUseCase;

describe('GetByIdProductUseCase', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new ProductInMemoryRepository();
    sut = new GetByIdProductUseCase(inMemoryProductsRepository);
  });

  it('Should not be able get a product by id invalid', async () => {
    const productOrError = makeProduct({}, new UniqueEntityID('product1'));

    if (productOrError.isLeft()) {
      return null;
    }

    inMemoryProductsRepository.items.push(productOrError.value);

    const result = await sut.execute({ id: 'product2' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('Should be able get a product by id', async () => {
    const productOrError = makeProduct({}, new UniqueEntityID('product1'));

    if (productOrError.isLeft()) {
      return null;
    }

    inMemoryProductsRepository.items.push(productOrError.value);

    const result = await sut.execute({ id: 'product1' });

    expect(result.isRight()).toBe(true);
    expect(inMemoryProductsRepository.items).toHaveLength(1);
  });
});
