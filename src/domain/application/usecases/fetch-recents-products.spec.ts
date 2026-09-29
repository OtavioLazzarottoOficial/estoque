import { makeProduct } from '../../../../test/factories/make-product';
import { ProductInMemoryRepository } from '../../../../test/in-memory/product-in-memory-repository';
import { FetchRecentsProductsUseCase } from './fetch-recents-products.usecase';

let productsInMemoryRepository: ProductInMemoryRepository;
let sut: FetchRecentsProductsUseCase;

describe('FetchRecentsProductsUseCase', () => {
  beforeEach(() => {
    productsInMemoryRepository = new ProductInMemoryRepository();
    sut = new FetchRecentsProductsUseCase(productsInMemoryRepository);
  });

  it('Should be able to fetch recents products', async () => {
    const product1 = makeProduct({
      createdAt: new Date('2026-09-10T00:00:00Z'),
    });

    if (product1.isLeft()) {
      return null;
    }

    productsInMemoryRepository.items.push(product1.value);

    const product2 = makeProduct({
      createdAt: new Date('2026-09-01T00:00:00Z'),
    });

    if (product2.isLeft()) {
      return null;
    }

    productsInMemoryRepository.items.push(product2.value);

    const result = await sut.execute({ page: 1 });

    expect(result.isRight()).toBe(true);

    expect(result.value?.products).toHaveLength(2);

    expect(result.value?.products[0].createdAt).toEqual(
      new Date('2026-09-10T00:00:00Z'),
    );
    expect(result.value?.products[1].createdAt).toEqual(
      new Date('2026-09-01T00:00:00Z'),
    );
  });
});
