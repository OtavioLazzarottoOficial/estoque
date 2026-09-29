import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { Public } from '@/infra/auth/public';
import { ResourceNotFoundError } from '@/domain/application/usecases/errors/resource-not-found-error';
import { QuantityCannotBeLessOrEqualThanZeroError } from '@/domain/enterprise/entities/errors/quantity-cannot-be-less-or-equal-than-zero-error';
import { StockPresenter } from '../presenters/stock-presenter';
import { CreateStockUseCase } from '@/domain/application/usecases/create-stock-usecase';

const createStockSchemaBody = z.object({
  productId: z.uuid(),
  quantityInStock: z.number(),
  quantityMax: z.number(),
  quantityMin: z.number(),
});

type CreateStockSchemaBody = z.infer<typeof createStockSchemaBody>;

const bodyValidation = new ZodValidationPipe(createStockSchemaBody);

@Controller()
export class CreateStockController {
  constructor(private createStockUseCase: CreateStockUseCase) {}

  @Post('/stock')
  @Public()
  async handle(@Body(bodyValidation) body: CreateStockSchemaBody) {
    const { productId, quantityInStock, quantityMax, quantityMin } = body;

    const result = await this.createStockUseCase.execute({
      productId,
      quantityInStock,
      quantityMax,
      quantityMin,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        case QuantityCannotBeLessOrEqualThanZeroError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { stock } = result.value;

    return StockPresenter.toHttp(stock);
  }
}
