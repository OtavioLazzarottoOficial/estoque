import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { Stock } from '@/domain/enterprise/entities/stock';
import { Injectable } from '@nestjs/common';
import { StocksRepository } from '../repositories/stocks-repository';

type GetStockByProductRequest = {
  productId: string;
};

type GetStockByProductResponse = Either<
  ResourceNotFoundError,
  { stock: Stock }
>;

@Injectable()
export class GetStockByProductUseCase {
  constructor(private stocksRepository: StocksRepository) {}

  async execute({
    productId,
  }: GetStockByProductRequest): Promise<GetStockByProductResponse> {
    const stock = await this.stocksRepository.getStockByProduct(productId);

    if (!stock) {
      return left(new ResourceNotFoundError());
    }

    return right({ stock });
  }
}
