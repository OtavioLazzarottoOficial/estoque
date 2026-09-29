import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { MovementsStockInMemoryRepository } from '../../../../test/in-memory/stock-movements-in-memory-repository';
import { StocksInMemoryRepository } from '../../../../test/in-memory/stocks-in-memory-repository';
import { UsersInMemoryRepository } from '../../../../test/in-memory/users-in-memory-repository';
import { makeProduct } from '../../../../test/factories/make-product';
import { makeStock } from '../../../../test/factories/make-stock';
import { makeUser } from '../../../../test/factories/make-user';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { QuantityCannotBeLessOrEqualThanZeroError } from '@/domain/enterprise/entities/errors/quantity-cannot-be-less-or-equal-than-zero-error';
import { QuantityCannotBeLessThanQuantityMinError } from '@/domain/enterprise/entities/errors/quantity-cannot-be-less-than-quantity-min-error';
import { DecreaseInStockUseCase } from './decrease-in-stock-usecase';

let stocksInMemoryRepository: StocksInMemoryRepository;
let usersInMemoryRepository: UsersInMemoryRepository;
let movementsStockInMemoryRepository: MovementsStockInMemoryRepository;
let sut: DecreaseInStockUseCase;

describe('GetByIdProductUseCase', () => {
  beforeEach(() => {
    stocksInMemoryRepository = new StocksInMemoryRepository();
    usersInMemoryRepository = new UsersInMemoryRepository();
    movementsStockInMemoryRepository = new MovementsStockInMemoryRepository();
    sut = new DecreaseInStockUseCase(
      stocksInMemoryRepository,
      movementsStockInMemoryRepository,
      usersInMemoryRepository,
    );
  });

  it('Should not be able decrease the Stock with id invalid', async () => {
    const productOrError = makeProduct({}, new UniqueEntityID('product1'));

    if (productOrError.isLeft()) {
      return null;
    }

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

    const user = makeUser({}, new UniqueEntityID('user1'));

    usersInMemoryRepository.items.push(user);

    const result = await sut.execute({
      stockId: 'stock2',
      userId: user.id.toString(),
      quantity: 5,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('Should not be able decrease the Stock with a user invalid', async () => {
    const productOrError = makeProduct({}, new UniqueEntityID('product1'));

    if (productOrError.isLeft()) {
      return null;
    }

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

    const user = makeUser({}, new UniqueEntityID('user1'));

    usersInMemoryRepository.items.push(user);

    const result = await sut.execute({
      stockId: stockOrError.value.id.toString(),
      userId: 'user2',
      quantity: 5,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('Should not be able decrease the Stock with the quantity less or equal than zero', async () => {
    const productOrError = makeProduct({}, new UniqueEntityID('product1'));

    if (productOrError.isLeft()) {
      return null;
    }

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

    const user = makeUser({}, new UniqueEntityID('user1'));

    usersInMemoryRepository.items.push(user);

    const result = await sut.execute({
      stockId: stockOrError.value.id.toString(),
      userId: user.id.toString(),
      quantity: 0,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(
      QuantityCannotBeLessOrEqualThanZeroError,
    );
  });

  it('Should not be able decrease the Stock with the quantity less or equal than zero', async () => {
    const productOrError = makeProduct({}, new UniqueEntityID('product1'));

    if (productOrError.isLeft()) {
      return null;
    }

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

    const user = makeUser({}, new UniqueEntityID('user1'));

    usersInMemoryRepository.items.push(user);

    const result = await sut.execute({
      stockId: stockOrError.value.id.toString(),
      userId: user.id.toString(),
      quantity: -10,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(
      QuantityCannotBeLessOrEqualThanZeroError,
    );
  });

  it('Should not be able decrease the Stock with the quantity in stock less than quantity min', async () => {
    const productOrError = makeProduct({}, new UniqueEntityID('product1'));

    if (productOrError.isLeft()) {
      return null;
    }

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

    const user = makeUser({}, new UniqueEntityID('user1'));

    usersInMemoryRepository.items.push(user);

    const result = await sut.execute({
      stockId: stockOrError.value.id.toString(),
      userId: user.id.toString(),
      quantity: 10,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(
      QuantityCannotBeLessThanQuantityMinError,
    );
  });

  it('Should be able increase the Stock', async () => {
    const productOrError = makeProduct({}, new UniqueEntityID('product1'));

    if (productOrError.isLeft()) {
      return null;
    }

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

    const user = makeUser({}, new UniqueEntityID('user1'));

    usersInMemoryRepository.items.push(user);

    const result = await sut.execute({
      stockId: stockOrError.value.id.toString(),
      userId: user.id.toString(),
      quantity: 5,
    });

    expect(result.isRight()).toBe(true);
    expect(stocksInMemoryRepository.items[0].quantityInStock).toEqual(5);
    expect(movementsStockInMemoryRepository.items).toHaveLength(1);
  });
});
