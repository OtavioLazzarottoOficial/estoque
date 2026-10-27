import { UseCaseError } from '@/core/error/use-case-error';

export class ImageTooLargeError extends Error implements UseCaseError {
  constructor(maxSizeInBytes: number) {
    const maxSizeInMb = (maxSizeInBytes / (1024 * 1024)).toFixed(0);
    super(`Image exceeds the maximum allowed size of ${maxSizeInMb}MB.`);
  }
}
