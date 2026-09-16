import { Either, left, right } from '../../../core/either';
import { Entity } from '../../../core/entities/entity';
import { UniqueEntityID } from '../../../core/entities/unique-entity-id';
import { Optional } from '../../../core/types/optional';
import { QuantityCannotBeLessOrEqualThanZeroError } from './errors/quantity-cannot-be-less-or-equal-than-zero-error';

export enum Reason {
  OUTPUT = 'Output',
  INPUT = 'Input',
}

export type StockMovementProps = {
  productId: UniqueEntityID;
  stockId: UniqueEntityID;
  userId: UniqueEntityID;
  quantity: number;
  reason: Reason;
  createdAt: Date;
};

export class StockMovement extends Entity<StockMovementProps> {
  get productId() {
    return this.props.productId;
  }

  get stockId() {
    return this.props.stockId;
  }

  get userId() {
    return this.props.userId;
  }

  get quantity() {
    return this.props.quantity;
  }

  get reason() {
    return this.props.reason;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(
    props: Optional<StockMovementProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): Either<QuantityCannotBeLessOrEqualThanZeroError, StockMovement> {
    if (props.quantity <= 0) {
      return left(new QuantityCannotBeLessOrEqualThanZeroError());
    }

    const stockMovement = new StockMovement(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return right(stockMovement);
  }
}
