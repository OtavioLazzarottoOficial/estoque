import { UseCaseError } from '../../../../core/error/use-case-error';

export class ExistUserWithThisEmailError extends Error implements UseCaseError {
  constructor(email: string) {
    super(`Existing user with this email: ${email}`);
  }
}
