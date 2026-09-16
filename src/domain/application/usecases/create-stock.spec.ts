import { StocksInMemoryRepository } from 'test/in-memory/stocks-in-memory-repository';
import { ProductInMemoryRepository } from '../../../../test/in-memory/product-in-memory-repository';
import { UniqueEntityID } from '../../../core/entities/unique-entity-id';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { CreateStockUseCase } from './create-stock-usecase';
import { makeProduct } from 'test/factories/make-product';
import { QuantityCannotBeLessOrEqualThanZeroError } from '../../enterprise/entities/errors/quantity-cannot-be-less-or-equal-than-zero-error';

let productInMemoryRepository: ProductInMemoryRepository;
let stocksInMemoryRepository: StocksInMemoryRepository;
let sut: CreateStockUseCase;
describe('Create Product Use Case', () => {
  beforeEach(() => {
    productInMemoryRepository = new ProductInMemoryRepository();
    stocksInMemoryRepository = new StocksInMemoryRepository();
    sut = new CreateStockUseCase(
      stocksInMemoryRepository,
      productInMemoryRepository,
    );
  });

  it('Should not be able create the stock with product invalid.', async () => {
    const productOrError = makeProduct({}, new UniqueEntityID('product2'));

    if (productOrError.isLeft()) {
      return null;
    }

    productInMemoryRepository.items.push(productOrError.value);

    const result = await sut.execute({
      productId: 'product1',
      quantityMax: 20,
      quantityMin: 1,
      quantityInStock: 5,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('Should not be able create the stock with quantityInStock less or equal the zero.', async () => {
    const productOrError = makeProduct({}, new UniqueEntityID('product1'));

    if (productOrError.isLeft()) {
      return null;
    }

    productInMemoryRepository.items.push(productOrError.value);

    const result = await sut.execute({
      productId: 'product1',
      quantityMax: 20,
      quantityMin: 1,
      quantityInStock: 0,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(
      QuantityCannotBeLessOrEqualThanZeroError,
    );
  });
});
