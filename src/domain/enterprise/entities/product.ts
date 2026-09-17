import { Either, left, right } from '../../../core/either';
import { AggregateRoot } from '../../../core/entities/aggregate-root';
import { UniqueEntityID } from '../../../core/entities/unique-entity-id';
import { Optional } from '../../../core/types/optional';
import { PriceCannotBeLessThanZeroError } from './errors/price-cannot-be-less-than-zero.error';
import { SkuObjectValue } from './value-objects/sku-value-object';

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
  status: Status;
  price: number;
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

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<ProductProps, 'status' | 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ): Either<PriceCannotBeLessThanZeroError, Product> {
    if (props.price < 0) {
      return left(new PriceCannotBeLessThanZeroError());
    }
    const product = new Product(
      {
        ...props,
        status: props.status ?? Status.ACTIVE,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.createdAt ?? null,
      },
      id,
    );

    return right(product);
  }
}
