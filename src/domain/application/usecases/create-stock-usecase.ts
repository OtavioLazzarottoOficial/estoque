import { Either, left, right } from '@/core/either';
import { QuantityCannotBeLessOrEqualThanZeroError } from '@/domain/enterprise/entities/errors/quantity-cannot-be-less-or-equal-than-zero-error';
import { QuantityMaxCannotBeLessThanQuantityMinError } from '@/domain/enterprise/entities/errors/quantity-max-cannot-be-less-than-quantity-min-error';
import { QuantityMinCannotBeMoreThanQuantityMaxError } from '@/domain/enterprise/entities/errors/quantity-min-cannot-be-more-than-quantity-max-error';
import { Stock } from '@/domain/enterprise/entities/stock';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../repositories/products-repository';
import { StocksRepository } from '../repositories/stocks-repository';

type CreateStockUseCaseRequestDTO = {
  productId: string;
  quantityInStock: number;
  quantityMax: number;
  quantityMin: number;
};

type CreateStockUseCaseResponse = Either<
  | ResourceNotFoundError
  | QuantityCannotBeLessOrEqualThanZeroError
  | QuantityMinCannotBeMoreThanQuantityMaxError
  | QuantityMaxCannotBeLessThanQuantityMinError,
  { stock: Stock }
>;

@Injectable()
export class CreateStockUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private stocksRepository: StocksRepository,
  ) {}

  async execute({
    productId,
    quantityInStock,
    quantityMax,
    quantityMin,
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
