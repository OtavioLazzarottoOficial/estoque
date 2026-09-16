import { Either, left, right } from '../../../core/either';
import { AggregateRoot } from '../../../core/entities/aggregate-root';
import { UniqueEntityID } from '../../../core/entities/unique-entity-id';
import { Optional } from '../../../core/types/optional';
import { QuantityCannotBeLessOrEqualThanZeroError } from './errors/quantity-cannot-be-less-or-equal-than-zero-error';
import { QuantityCannotBeLessThanQuantityMinError } from './errors/quantity-cannot-be-less-than-quantity-min-error';
import { QuantityCannotBeMoreThanQuantityMaxError } from './errors/quantity-cannot-be-more-than-quantity-max-error';
import { QuantityMaxCannotBeLessThanQuantityMinError } from './errors/quantity-max-cannot-be-less-than-quantity-min-error';
import { QuantityMinCannotBeMoreThanQuantityMaxError } from './errors/quantity-min-cannot-be-more-than-quantity-max-error';

export type StockProps = {
  productId: UniqueEntityID;
  quantityInStock: number;
  quantityMax: number;
  quantityMin: number;
  createdAt: Date;
  updatedAt: Date | null;
};

export class Stock extends AggregateRoot<StockProps> {
  get productId() {
    return this.props.productId;
  }

  get quantityInStock() {
    return this.props.quantityInStock;
  }

  get quantityMax() {
    return this.props.quantityMax;
  }

  get quantityMin() {
    return this.props.quantityMin;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  increase(
    quantity: number,
  ): Either<
    | QuantityCannotBeLessOrEqualThanZeroError
    | QuantityCannotBeMoreThanQuantityMaxError,
    null
  > {
    if (quantity <= 0) {
      return left(new QuantityCannotBeLessOrEqualThanZeroError());
    }

    const increase = this.props.quantityInStock + quantity;

    if (increase > this.props.quantityMax) {
      return left(new QuantityCannotBeMoreThanQuantityMaxError());
    }

    this.props.quantityInStock = increase;
    this.touch();

    return right(null);
  }

  decrease(
    quantity: number,
  ): Either<
    | QuantityCannotBeLessOrEqualThanZeroError
    | QuantityCannotBeMoreThanQuantityMaxError,
    null
  > {
    if (quantity <= 0) {
      return left(new QuantityCannotBeLessOrEqualThanZeroError());
    }

    const decrease = this.props.quantityInStock - quantity;

    if (decrease < this.props.quantityMin) {
      return left(new QuantityCannotBeLessThanQuantityMinError());
    }

    this.props.quantityInStock = decrease;
    this.touch();

    return right(null);
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<StockProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ): Either<
    | QuantityCannotBeLessOrEqualThanZeroError
    | QuantityMinCannotBeMoreThanQuantityMaxError
    | QuantityMaxCannotBeLessThanQuantityMinError,
    Stock
  > {
    if (props.quantityInStock <= 0) {
      return left(new QuantityCannotBeLessOrEqualThanZeroError());
    }

    if (props.quantityMin > props.quantityMax) {
      return left(new QuantityMinCannotBeMoreThanQuantityMaxError());
    }

    if (props.quantityMax < props.quantityMax) {
      return left(new QuantityMaxCannotBeLessThanQuantityMinError());
    }
    const stock = new Stock(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
      },
      id,
    );

    return right(stock);
  }
}
