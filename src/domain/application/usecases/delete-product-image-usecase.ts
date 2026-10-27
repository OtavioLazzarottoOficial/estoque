import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ProductsRepository } from '../repositories/products-repository';
import { ImageUploader } from '../services/image-uploader';
import { Product } from '@/domain/enterprise/entities/product';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { ProductImageNotFoundError } from '@/domain/enterprise/entities/errors/product-image-not-found.error';

type DeleteProductImageUseCaseRequest = {
  productId: string;
  imageId: string;
};

type DeleteProductImageUseCaseResponse = Either<
  ResourceNotFoundError | ProductImageNotFoundError,
  {
    product: Product;
  }
>;

@Injectable()
export class DeleteProductImageUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private imageUploader: ImageUploader,
  ) {}

  async execute({
    productId,
    imageId,
  }: DeleteProductImageUseCaseRequest): Promise<DeleteProductImageUseCaseResponse> {
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      return left(new ResourceNotFoundError('Product not found'));
    }

    const removeResult = product.removeImage(new UniqueEntityID(imageId));

    if (removeResult.isLeft()) {
      return left(removeResult.value);
    }

    const removedImage = removeResult.value;

    await this.productsRepository.save(product);
    await this.imageUploader.discard([removedImage.storageKey]);

    return right({ product });
  }
}
