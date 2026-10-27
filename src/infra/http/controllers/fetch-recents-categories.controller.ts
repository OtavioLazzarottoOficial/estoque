import { FetchRecentsCategoriesUseCase } from '@/domain/application/usecases/fetch-recents-categories.usecase';
import { Controller, Get, Query } from '@nestjs/common';
import z from 'zod';
import { CategoryPresenter } from '../presenters/category-presenter';
import { Public } from '@/infra/auth/public';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const fetchRecentsCategoriesSchemaParams = z.object({
  page: z.coerce.number().default(1),
});

type FetchRecentsCategoriesSchemaParams = z.infer<
  typeof fetchRecentsCategoriesSchemaParams
>;

const queryValidation = new ZodValidationPipe(
  fetchRecentsCategoriesSchemaParams,
);

@Controller()
export class FetchRecentsCategoriesController {
  constructor(
    private fetchRecentsCategoriesUseCase: FetchRecentsCategoriesUseCase,
  ) {}

  @Get('/categories')
  @Public()
  async handle(
    @Query(queryValidation) page: FetchRecentsCategoriesSchemaParams,
  ) {
    const result = await this.fetchRecentsCategoriesUseCase.execute(page);

    const { value } = result;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    return value?.categories.map(CategoryPresenter.toHTTP) ?? [];
  }
}
