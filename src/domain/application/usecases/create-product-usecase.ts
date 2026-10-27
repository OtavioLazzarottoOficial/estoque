import { Injectable } from '@nestjs/common';
import { Either, left, right } from '../../../core/either';
import { PriceCannotBeLessThanZeroError } from '../../enterprise/entities/errors/price-cannot-be-less-than-zero.error';
import { MaxImagesExceededError } from '../../enterprise/entities/errors/max-images-exceeded.error';
import { Product, Status } from '../../enterprise/entities/product';
import { ProductImage } from '../../enterprise/entities/product-image';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { ProductsRepository } from '../repositories/products-repository';
import { CategoriesRepository } from '../repositories/categories-repository';
import { UniqueEntityID } from '../../../core/entities/unique-entity-id';
import { SkuObjectValue } from '../../enterprise/entities/value-objects/sku-value-object';
import { ProductWithNameExists } from './errors/product-with-name-exists-error';
import { ImageInput, ImageUploader } from '../services/image-uploader';
import { ImageTooLargeError } from '@/domain/enterprise/entities/value-objects/errors/image-too-large.error';
import { InvalidImageMimeTypeError } from '@/domain/enterprise/entities/value-objects/errors/invalid-image-mime-type.error';
import { PRODUCT_IMAGE_POLICY } from '@/domain/enterprise/entities/value-objects/image-policies';

type CreateProductUseCaseRequestDTO = {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  status?: Status;
  images?: ImageInput[];
};

type CreateProductUseCaseResponse = Either<
  | PriceCannotBeLessThanZeroError
  | ResourceNotFoundError
  | ProductWithNameExists
  | InvalidImageMimeTypeError
  | ImageTooLargeError
  | MaxImagesExceededError,
  {
    product: Product;
  }
>;

@Injectable()
export class CreateProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private categoriesRepository: CategoriesRepository,
    private imageUploader: ImageUploader,
  ) {}

  async execute({
    name,
    price,
    categoryId,
    status,
    description,
    images = [],
  }: CreateProductUseCaseRequestDTO): Promise<CreateProductUseCaseResponse> {
    const category = await this.categoriesRepository.findById(categoryId);

    if (!category) {
      return left(new ResourceNotFoundError());
    }

    const existProductWithName = await this.productsRepository.findByName(name);

    if (existProductWithName) {
      return left(new ProductWithNameExists(name));
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

    const product = productOrError.value;

    // sem imagens: fluxo idêntico ao que você já tinha
    if (images.length === 0) {
      await this.productsRepository.create(product);
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

    // tudo validado: só agora enviamos bytes ao R2
    await this.imageUploader.upload(prepared);

    try {
      await this.productsRepository.create(product);
    } catch (error) {
      await this.imageUploader.discard(
        prepared.map(({ file }) => file.storageKey),
      );
      throw error;
    }

    return right({ product });
  }
}
