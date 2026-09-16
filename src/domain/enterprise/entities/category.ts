import { Entity } from '../../../core/entities/entity';
import { Optional } from '../../../core/types/optional';
import { UniqueEntityID } from '../../../core/entities/unique-entity-id';

export type CategoryProps = {
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export class Category extends Entity<CategoryProps> {
  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<CategoryProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ) {
    const category = new Category(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
      },
      id,
    );

    return category;
  }
}
