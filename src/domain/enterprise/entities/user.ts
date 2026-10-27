import { Entity } from '../../../core/entities/entity';
import { UniqueEntityID } from '../../../core/entities/unique-entity-id';
import { Optional } from '../../../core/types/optional';
import { EmailValueObject } from './value-objects/email-value-object';
import { ImageFile } from './value-objects/image-file';
import { PasswordValueObject } from './value-objects/password-value-object';

export enum Roles {
  ADMIN = 'ADMIN',
  WAREHOUSE = 'WAREHOUSE',
  USER = 'USER',
}

export type UserProps = {
  name: string;
  email: EmailValueObject;
  password: PasswordValueObject;
  avatar: ImageFile | null;
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

  get avatar() {
    return this.props.avatar;
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

  changeAvatar(avatar: ImageFile): ImageFile | null {
    const previous = this.props.avatar;
    this.props.avatar = avatar;
    this.touch();
    return previous; // o use case apaga o arquivo antigo do storage
  }

  removeAvatar(): ImageFile | null {
    const previous = this.props.avatar;
    this.props.avatar = null;
    this.touch();
    return previous;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<UserProps, 'createdAt' | 'updatedAt' | 'avatar'>,
    id?: UniqueEntityID,
  ) {
    const user = new User(
      {
        ...props,
        avatar: props.avatar ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
      },
      id,
    );

    return user;
  }
}
