import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResourceNotFoundError } from '@/domain/application/usecases/errors/resource-not-found-error';
import { ProductWithNameExists } from '@/domain/application/usecases/errors/product-with-name-exists-error';
import { PriceCannotBeLessThanZeroError } from '@/domain/enterprise/entities/errors/price-cannot-be-less-than-zero.error';
import { QuantityCannotBeLessThanZeroError } from '@/domain/enterprise/entities/errors/quantity-cannot-be-less-than-zero-error';
import { QuantityCannotBeLessOrEqualThanZeroError } from '@/domain/enterprise/entities/errors/quantity-cannot-be-less-or-equal-than-zero-error';
import { QuantityCannotBeMoreThanQuantityMaxError } from '@/domain/enterprise/entities/errors/quantity-cannot-be-more-than-quantity-max-error';
import { QuantityCannotBeLessThanQuantityMinError } from '@/domain/enterprise/entities/errors/quantity-cannot-be-less-than-quantity-min-error';
import { InvalidImageMimeTypeError } from '@/domain/enterprise/entities/value-objects/errors/invalid-image-mime-type.error';
import { ImageTooLargeError } from '@/domain/enterprise/entities/value-objects/errors/image-too-large.error';
import { MaxImagesExceededError } from '@/domain/enterprise/entities/errors/max-images-exceeded.error';
import { ProductImageNotFoundError } from '@/domain/enterprise/entities/errors/product-image-not-found.error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : typeof exceptionResponse === 'object' &&
              exceptionResponse !== null &&
              'message' in exceptionResponse
            ? String((exceptionResponse as Record<string, unknown>).message)
            : message;

      return response.status(status).json({
        statusCode: status,
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    if (exception instanceof Error) {
      message = exception.message;

      if (
        exception instanceof ResourceNotFoundError ||
        exception instanceof ProductImageNotFoundError
      ) {
        status = HttpStatus.NOT_FOUND;
      } else if (exception instanceof ProductWithNameExists) {
        status = HttpStatus.CONFLICT;
      } else if (
        exception instanceof PriceCannotBeLessThanZeroError ||
        exception instanceof QuantityCannotBeLessThanZeroError ||
        exception instanceof QuantityCannotBeLessOrEqualThanZeroError ||
        exception instanceof QuantityCannotBeMoreThanQuantityMaxError ||
        exception instanceof QuantityCannotBeLessThanQuantityMinError ||
        exception instanceof InvalidImageMimeTypeError ||
        exception instanceof ImageTooLargeError ||
        exception instanceof MaxImagesExceededError
      ) {
        status = HttpStatus.BAD_REQUEST;
      } else if (exception.constructor.name === 'NotAllowedError') {
        status = HttpStatus.FORBIDDEN;
      }
    }

    return response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
