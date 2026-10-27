import { ResourceNotFoundError } from '@/domain/application/usecases/errors/resource-not-found-error';
import { Public } from '@/infra/auth/public';
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import z from 'zod';
import { GetStockByProductUseCase } from '@/domain/application/usecases/get-stock-by-product';
import { StockPresenter } from '../presenters/stock-presenter';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const getStockByProductSchemaParam = z.object({
  productId: z.string().uuid(),
});

type GetStockByProductSchemaParam = z.infer<
  typeof getStockByProductSchemaParam
>;

const paramValidation = new ZodValidationPipe(getStockByProductSchemaParam);

@Controller()
export class GetStockByProductController {
  constructor(private getStockByProductUseCase: GetStockByProductUseCase) {}

  @Get('/stock/product/:productId')
  @Public()
  async handle(
    @Param(paramValidation) { productId }: GetStockByProductSchemaParam,
  ) {
    const result = await this.getStockByProductUseCase.execute({ productId });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return StockPresenter.toHttp(result.value.stock);
  }
}
