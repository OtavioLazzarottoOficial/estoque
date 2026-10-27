import { UseCaseError } from '@/core/error/use-case-error';

export class InvalidImageMimeTypeError extends Error implements UseCaseError {
  constructor(mimeType: string) {
    super(`File type "${mimeType}" is not allowed.`);
  }
}
