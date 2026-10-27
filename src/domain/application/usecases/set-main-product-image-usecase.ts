import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ProductsRepository } from '../repositories/products-repository';
import { Product } from '@/domain/enterprise/entities/product';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { ProductImageNotFoundError } from '@/domain/enterprise/entities/errors/product-image-not-found.error';

type SetMainProductImageUseCaseRequest = {
  productId: string;
  imageId: string;
};

type SetMainProductImageUseCaseResponse = Either<
  ResourceNotFoundError | ProductImageNotFoundError,
  {
    product: Product;
  }
>;

@Injectable()
export class SetMainProductImageUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productId,
    imageId,
  }: SetMainProductImageUseCaseRequest): Promise<SetMainProductImageUseCaseResponse> {
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      return left(new ResourceNotFoundError('Product not found'));
    }

    const result = product.setMainImage(new UniqueEntityID(imageId));

    if (result.isLeft()) {
      return left(result.value);
    }

    await this.productsRepository.save(product);

    return right({ product });
  }
}
