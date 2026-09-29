import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { StocksRepository } from '../repositories/stocks-repository';
import { MovementsStockRepository } from '../repositories/movements-stock-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { QuantityCannotBeLessOrEqualThanZeroError } from '@/domain/enterprise/entities/errors/quantity-cannot-be-less-or-equal-than-zero-error';
import { QuantityCannotBeMoreThanQuantityMaxError } from '@/domain/enterprise/entities/errors/quantity-cannot-be-more-than-quantity-max-error';
import {
  Reason,
  StockMovement,
} from '@/domain/enterprise/entities/stockMovement';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { UsersRepository } from '../repositories/users-repository';

type IncreaseInStockUseCaseRequestDTO = {
  stockId: string;
  userId: string;
  quantity: number;
};

type IncreaseInStockUseCaseResponse = Either<
  | ResourceNotFoundError
  | QuantityCannotBeLessOrEqualThanZeroError
  | QuantityCannotBeMoreThanQuantityMaxError,
  null
>;

@Injectable()
export class IncreaseInStockUseCase {
  constructor(
    private stocksRepository: StocksRepository,
    private movementsStockRepository: MovementsStockRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    stockId,
    userId,
    quantity,
  }: IncreaseInStockUseCaseRequestDTO): Promise<IncreaseInStockUseCaseResponse> {
    const stock = await this.stocksRepository.findById(stockId);

    if (!stock) {
      return left(new ResourceNotFoundError());
    }

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const increaseStockOrError = stock.increase(quantity);

    if (increaseStockOrError.isLeft()) {
      return left(increaseStockOrError.value);
    }

    const movementStockOrError = StockMovement.create({
      productId: stock.productId,
      quantity,
      reason: Reason.INPUT,
      stockId: new UniqueEntityID(stockId),
      userId: new UniqueEntityID(userId),
    });

    if (movementStockOrError.isLeft()) {
      return left(movementStockOrError.value);
    }

    await this.movementsStockRepository.create(movementStockOrError.value);

    await this.stocksRepository.save(stock);

    return right(null);
  }
}
