import { UseCaseError } from '../../../../core/error/use-case-error';

export class ProductWithNameExists extends Error implements UseCaseError {
  constructor(name: string) {
    super(`Product with the name: ${name} exists`);
  }
}
