import { UseCaseError } from '@/core/error/use-case-error';

export class ProductImageNotFoundError extends Error implements UseCaseError {
  constructor(imageId: string) {
    super(`Product image "${imageId}" not found.`);
  }
}
