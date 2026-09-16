import { Either, left, right } from '../../../../core/either';
import { ValueObject } from '../../../../core/entities/object-value';
import { InvalidPasswordError } from './errors/invalid-password-error';

export type PasswordProps = {
  value: string;
};

export class PasswordValueObject extends ValueObject<PasswordProps> {
  private constructor(props: PasswordProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(
    password: string,
  ): Either<InvalidPasswordError, PasswordValueObject> {
    const cleanPassword = password.trim();
    const REGEX_PASSWORD = /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

    if (cleanPassword === '') {
      return left(new InvalidPasswordError(password));
    }

    if (!REGEX_PASSWORD.test(cleanPassword)) {
      return left(new InvalidPasswordError(password));
    }

    return right(new PasswordValueObject({ value: cleanPassword }));
  }

  static createFromHash(hash: string): PasswordValueObject {
    return new PasswordValueObject({ value: hash });
  }
}
