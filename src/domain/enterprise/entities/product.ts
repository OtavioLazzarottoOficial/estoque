import { Either, left, right } from '../../../core/either';
import { AggregateRoot } from '../../../core/entities/aggregate-root';
import { UniqueEntityID } from '../../../core/entities/unique-entity-id';
import { Optional } from '../../../core/types/optional';
import { Category } from './category';
import { MaxImagesExceededError } from './errors/max-images-exceeded.error';
import { PriceCannotBeLessThanZeroError } from './errors/price-cannot-be-less-than-zero.error';
import { ProductImageNotFoundError } from './errors/product-image-not-found.error';
import { ProductImage } from './product-image';
import { SkuObjectValue } from './value-objects/sku-value-object';

export const MAX_IMAGES_PER_PRODUCT = 10;

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export type ProductProps = {
  sku: SkuObjectValue;
  name: string;
  description: string;
  categoryId: UniqueEntityID;
  category?: Category;
  status: Status;
  price: number;
  images: ProductImage[];
  createdAt: Date;
  updatedAt: Date | null;
};

export class Product extends AggregateRoot<ProductProps> {
  get sku() {
    return this.props.sku.value;
  }

  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get categoryId() {
    return this.props.categoryId.toString();
  }

  get price() {
    return this.props.price;
  }

  get status() {
    return this.props.status;
  }

  get category() {
    return this.props.category ?? undefined;
  }

  get images() {
    return [...this.props.images]; // cópia, para ninguém mutar o array por fora
  }

  get mainImage() {
    return this.props.images[0] ?? null;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  addImages(images: ProductImage[]): Either<MaxImagesExceededError, null> {
    if (this.props.images.length + images.length > MAX_IMAGES_PER_PRODUCT) {
      return left(new MaxImagesExceededError(MAX_IMAGES_PER_PRODUCT));
    }

    this.props.images.push(...images);
    this.touch();

    return right(null);
  }

  removeImage(
    imageId: UniqueEntityID,
  ): Either<ProductImageNotFoundError, ProductImage> {
    const index = this.props.images.findIndex((image) =>
      image.id.equals(imageId),
    );

    if (index === -1) {
      return left(new ProductImageNotFoundError(imageId.toString()));
    }

    const [removed] = this.props.images.splice(index, 1);
    this.touch();

    return right(removed);
  }

  setMainImage(
    imageId: UniqueEntityID,
  ): Either<ProductImageNotFoundError, null> {
    const index = this.props.images.findIndex((image) =>
      image.id.equals(imageId),
    );

    if (index === -1) {
      return left(new ProductImageNotFoundError(imageId.toString()));
    }

    const [image] = this.props.images.splice(index, 1);
    this.props.images.unshift(image);
    this.touch();

    return right(null);
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<
      ProductProps,
      'status' | 'createdAt' | 'updatedAt' | 'images'
    >,
    id?: UniqueEntityID,
  ): Either<PriceCannotBeLessThanZeroError, Product> {
    if (props.price < 0) {
      return left(new PriceCannotBeLessThanZeroError());
    }

    const product = new Product(
      {
        ...props,
        status: props.status ?? Status.ACTIVE,
        images: props.images ?? [],
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
      },
      id,
    );

    return right(product);
  }
}
