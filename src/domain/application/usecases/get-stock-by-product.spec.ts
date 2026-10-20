import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeProduct } from '../../../../test/factories/make-product';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { GetStockByProdutUseCase } from './get-stock-by-product';
import { StocksInMemoryRepository } from '../../../../test/in-memory/stocks-in-memory-repository';
import { ProductInMemoryRepository } from '../../../../test/in-memory/product-in-memory-repository';
import { makeStock } from '../../../../test/factories/make-stock';

let stocksInMemoryRepository: StocksInMemoryRepository;
let inMemoryProductsRepository: ProductInMemoryRepository;
let sut: GetStockByProdutUseCase;

describe('GetStockByProductUseCase', () => {
  beforeEach(() => {
    stocksInMemoryRepository = new StocksInMemoryRepository();
    inMemoryProductsRepository = new ProductInMemoryRepository();
    sut = new GetStockByProdutUseCase(stocksInMemoryRepository);
  });

  it('Should not be able get a product by id invalid', async () => {
    const productOrError = makeProduct({}, new UniqueEntityID('product1'));

    if (productOrError.isLeft()) {
      return null;
    }

    inMemoryProductsRepository.items.push(productOrError.value);

    const stockOrError = makeStock(
      {
        productId: productOrError.value.id,
        quantityInStock: 10,
        quantityMax: 20,
        quantityMin: 2,
      },
      new UniqueEntityID('stock1'),
    );

    if (stockOrError.isLeft()) {
      return null;
    }

    stocksInMemoryRepository.items.push(stockOrError.value);

    const result = await sut.execute({ productId: 'product2' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('Should be able get a product by id', async () => {
    const productOrError = makeProduct({}, new UniqueEntityID('product1'));

    if (productOrError.isLeft()) {
      return null;
    }

    inMemoryProductsRepository.items.push(productOrError.value);

    const stockOrError = makeStock(
      {
        productId: productOrError.value.id,
        quantityInStock: 10,
        quantityMax: 20,
        quantityMin: 2,
      },
      new UniqueEntityID('stock1'),
    );

    if (stockOrError.isLeft()) {
      return null;
    }

    stocksInMemoryRepository.items.push(stockOrError.value);

    const result = await sut.execute({ productId: 'product1' });

    expect(result.isRight()).toBe(true);
    expect(inMemoryProductsRepository.items).toHaveLength(1);
  });
});
