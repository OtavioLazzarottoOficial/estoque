// domain/entities/errors/max-images-exceeded.error.ts

import { UseCaseError } from '@/core/error/use-case-error';

export class MaxImagesExceededError extends Error implements UseCaseError {
  constructor(max: number) {
    super(`A product can have at most ${max} images.`);
  }
}
