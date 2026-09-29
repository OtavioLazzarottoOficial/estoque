import { Either, right } from '@/core/either';
import { Product } from '@/domain/enterprise/entities/product';
import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../repositories/products-repository';

type FetchRecentsProductsUseCaseRequest = {
  page: number;
};

type FetchRecentsProductsUseCaseResponse = Either<
  null,
  { products: Product[] }
>;

@Injectable()
export class FetchRecentsProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    page,
  }: FetchRecentsProductsUseCaseRequest): Promise<FetchRecentsProductsUseCaseResponse> {
    const products = await this.productsRepository.findManyRecent({ page });
    return right({ products });
  }
}
