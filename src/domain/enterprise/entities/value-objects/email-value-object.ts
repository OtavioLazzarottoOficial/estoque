import { ValueObject } from '../../../../core/entities/object-value';
import { Either, left, right } from '../../../../core/either';
import { EmailInvalidError } from './errors/email-invalid-error';

type EmailProps = {
  email: string;
};

export class EmailValueObject extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  get value(): string {
    return this.props.email;
  }

  static create(email: string): Either<EmailInvalidError, EmailValueObject> {
    const cleanEmail = email.trim().toLowerCase();

    const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const isEmail = REGEX_EMAIL.test(cleanEmail);
    if (isEmail) return right(new EmailValueObject({ email: cleanEmail }));

    return left(new EmailInvalidError(cleanEmail));
  }

  static createFromBD(email: string) {
    return new EmailValueObject({ email });
  }
}
