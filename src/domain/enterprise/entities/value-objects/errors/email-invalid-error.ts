import { UseCaseError } from '../../../../../core/error/use-case-error';

export class EmailInvalidError extends Error implements UseCaseError {
  constructor(email: string) {
    super(`Email is invalid: ${email}`);
  }
}
