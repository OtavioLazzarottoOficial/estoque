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
import { GetStockByProdutUseCase } from '@/domain/application/usecases/get-stock-by-product';
import { StockPresenter } from '../presenters/stock-presenter';

const getStockByProductSchemaParam = z.object({
  productId: z.uuid(),
});

type GetStockByProductSchemaParam = z.infer<
  typeof getStockByProductSchemaParam
>;

@Controller()
export class GetStockByProductController {
  constructor(private getStockByProdutUseCase: GetStockByProdutUseCase) {}

  @Get('/stock/product/:productId')
  @Public()
  async handle(@Param() { productId }: GetStockByProductSchemaParam) {
    const result = await this.getStockByProdutUseCase.execute({ productId });

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
