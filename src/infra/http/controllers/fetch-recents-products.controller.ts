import { Controller, Get, Query } from '@nestjs/common';
import z from 'zod';
import { FetchRecentsProductsUseCase } from '@/domain/application/usecases/fetch-recents-products.usecase';
import { ProductPresenter } from '../presenters/product-presenter';
import { Public } from '@/infra/auth/public';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const fetchRecentsProductsSchemaParams = z.object({
  page: z.coerce.number().default(1),
});

type FetchRecentsProductsSchemaParams = z.infer<
  typeof fetchRecentsProductsSchemaParams
>;

const queryValidation = new ZodValidationPipe(fetchRecentsProductsSchemaParams);

@Controller()
export class FetchRecentsProductsController {
  constructor(
    private fetchRecentsProductsUseCase: FetchRecentsProductsUseCase,
  ) {}

  @Get('/products')
  @Public()
  async handle(@Query(queryValidation) page: FetchRecentsProductsSchemaParams) {
    const result = await this.fetchRecentsProductsUseCase.execute(page);

    const { value } = result;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    return value?.products.map(ProductPresenter.toHttp) ?? [];
  }
}
