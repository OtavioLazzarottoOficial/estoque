import { Either, left, right } from '@/core/either';
import { Product } from '@/domain/enterprise/entities/product';
import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../repositories/products-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

type DeleteProductUseCaseRequest = {
  id: string;
};

type DeleteProductUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    product: Product;
  }
>;

@Injectable()
export class DeleteProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}
  async execute({
    id,
  }: DeleteProductUseCaseRequest): Promise<DeleteProductUseCaseResponse> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    await this.productsRepository.delete(product);
    return right({ product });
  }
}
