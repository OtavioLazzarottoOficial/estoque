import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { ProductsRepository } from '../repositories/products-repository';
import { ImageInput, ImageUploader } from '../services/image-uploader';
import { Product } from '@/domain/enterprise/entities/product';
import { ProductImage } from '@/domain/enterprise/entities/product-image';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { PRODUCT_IMAGE_POLICY } from '@/domain/enterprise/entities/value-objects/image-policies';
import { InvalidImageMimeTypeError } from '@/domain/enterprise/entities/value-objects/errors/invalid-image-mime-type.error';
import { ImageTooLargeError } from '@/domain/enterprise/entities/value-objects/errors/image-too-large.error';
import { MaxImagesExceededError } from '@/domain/enterprise/entities/errors/max-images-exceeded.error';

type UploadProductImagesUseCaseRequest = {
  productId: string;
  images: ImageInput[];
};

type UploadProductImagesUseCaseResponse = Either<
  | ResourceNotFoundError
  | InvalidImageMimeTypeError
  | ImageTooLargeError
  | MaxImagesExceededError,
  {
    product: Product;
  }
>;

@Injectable()
export class UploadProductImagesUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private imageUploader: ImageUploader,
  ) {}

  async execute({
    productId,
    images,
  }: UploadProductImagesUseCaseRequest): Promise<UploadProductImagesUseCaseResponse> {
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      return left(new ResourceNotFoundError('Product not found'));
    }

    if (images.length === 0) {
      return right({ product });
    }

    const preparedOrError = this.imageUploader.prepare(images, {
      folder: `products/${product.id.toString()}`,
      policy: PRODUCT_IMAGE_POLICY,
    });

    if (preparedOrError.isLeft()) {
      return left(preparedOrError.value);
    }

    const prepared = preparedOrError.value;

    const addResult = product.addImages(
      prepared.map(({ file }) => ProductImage.create({ file })),
    );

    if (addResult.isLeft()) {
      return left(addResult.value);
    }

    await this.imageUploader.upload(prepared);

    try {
      await this.productsRepository.save(product);
    } catch (error) {
      await this.imageUploader.discard(
        prepared.map(({ file }) => file.storageKey),
      );
      throw error;
    }

    return right({ product });
  }
}
