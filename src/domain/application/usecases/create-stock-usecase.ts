import { Injectable } from '@nestjs/common';
import { Either, left, right } from '../../../core/either';
import { QuantityCannotBeLessOrEqualThanZeroError } from '../../enterprise/entities/errors/quantity-cannot-be-less-or-equal-than-zero-error';
import { Stock } from '../../enterprise/entities/stock';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { StocksRepository } from '../repositories/stocks-repository';
import { ProductsRepository } from '../repositories/products-repository';

type CreateStockUseCaseRequestDTO = {
  productId: string;
  quantityInStock: number;
  quantityMax: number;
  quantityMin: number;
};

type CreateStockUseCaseResponse = Either<
  ResourceNotFoundError | QuantityCannotBeLessOrEqualThanZeroError,
  {
    stock: Stock;
  }
>;

Injectable();
export class CreateStockUseCase {
  constructor(
    private stocksRepository: StocksRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute({
    productId,
    quantityMax,
    quantityMin,
    quantityInStock,
  }: CreateStockUseCaseRequestDTO): Promise<CreateStockUseCaseResponse> {
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    const stockOrError = Stock.create({
      productId: product.id,
      quantityInStock,
      quantityMax,
      quantityMin,
    });

    if (stockOrError.isLeft()) {
      return left(stockOrError.value);
    }

    await this.stocksRepository.create(stockOrError.value);

    return right({ stock: stockOrError.value });
  }
}
