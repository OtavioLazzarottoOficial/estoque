import { UseCaseError } from '../../../../../core/error/use-case-error';

export class InvalidPasswordError extends Error implements UseCaseError {
  constructor(password: string) {
    super(`Password is invalid: ${password}`);
  }
}
