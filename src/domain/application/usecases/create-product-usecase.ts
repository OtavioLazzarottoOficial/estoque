import { Injectable } from '@nestjs/common';
import { Either, left, right } from '../../../core/either';
import { QuantityCannotBeLessThanZeroError } from '../../enterprise/entities/errors/quantity-cannot-be-less-than-zero-error';
import { Product, Status } from '../../enterprise/entities/product';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { ProductsRepository } from '../repositories/products-repository';
import { CategoriesRepository } from '../repositories/categories-repository';
import { UniqueEntityID } from '../../../core/entities/unique-entity-id';
import { SkuObjectValue } from '../../enterprise/entities/value-objects/sku-value-object';

type CreateProductUseCaseRequestDTO = {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  status: Status;
};

type CreateProductUseCaseResponse = Either<
  QuantityCannotBeLessThanZeroError | ResourceNotFoundError,
  {
    product: Product;
  }
>;

@Injectable()
export class CreateProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute({
    name,
    price,
    categoryId,
    status,
    description,
  }: CreateProductUseCaseRequestDTO): Promise<CreateProductUseCaseResponse> {
    const category = await this.categoriesRepository.findById(categoryId);

    if (!category) {
      return left(new ResourceNotFoundError());
    }

    const sku = SkuObjectValue.create({
      name,
      categoryName: category.name,
    });

    const productOrError = Product.create({
      categoryId: new UniqueEntityID(categoryId),
      name,
      description,
      price,
      sku,
      status,
    });

    if (productOrError.isLeft()) {
      return left(productOrError.value);
    }

    await this.productsRepository.create(productOrError.value);

    return right({ product: productOrError.value });
  }
}
