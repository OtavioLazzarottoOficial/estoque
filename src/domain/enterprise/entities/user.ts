import { Entity } from '../../../core/entities/entity';
import { UniqueEntityID } from '../../../core/entities/unique-entity-id';
import { Optional } from '../../../core/types/optional';
import { EmailValueObject } from './value-objects/email-value-object';
import { PasswordValueObject } from './value-objects/password-value-object';

export enum Roles {
  ADMIN = 'Admin',
  WAREHOUSE = 'Warehouse',
  USER = 'User',
}

export type UserProps = {
  name: string;
  email: EmailValueObject;
  password: PasswordValueObject;
  role: Roles;
  createdAt: Date;
  updatedAt: Date | null;
};

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email.value;
  }

  get password() {
    return this.props.password.value;
  }

  get role() {
    return this.props.role;
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
    props: Optional<UserProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
      },
      id,
    );

    return user;
  }
}
