import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { Product } from '@/domain/enterprise/entities/product';
import { ProductsRepository } from '../repositories/products-repository';

type GetByIdProductUseCaseRequestDTO = {
  id: string;
};

type GetByIdProductUseCaseResponse = Either<
  ResourceNotFoundError,
  { product: Product }
>;

@Injectable()
export class GetByIdProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    id,
  }: GetByIdProductUseCaseRequestDTO): Promise<GetByIdProductUseCaseResponse> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    return right({ product });
  }
}
