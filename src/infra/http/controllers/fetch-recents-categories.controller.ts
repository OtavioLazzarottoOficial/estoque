import { FetchRecentsCategoriesUseCase } from '@/domain/application/usecases/fetch-recents-categories.usecase';
import { Public } from '@/infra/auth/public';
import { Controller, Get, Query } from '@nestjs/common';
import z from 'zod';
import { CategoryPresenter } from '../presenters/category-presenter';

const fetchRecentsCategoriesSchemaParams = z.object({
  page: z.coerce.number().default(1),
});

type FetchRecentsCategoriesSchemaParams = z.infer<
  typeof fetchRecentsCategoriesSchemaParams
>;

@Controller()
export class FetchRecentsCategoriesController {
  constructor(
    private fetchRecentsCategoriesUseCase: FetchRecentsCategoriesUseCase,
  ) {}

  @Get('/Categories')
  @Public()
  async handle(@Query() page: FetchRecentsCategoriesSchemaParams) {
    const result = await this.fetchRecentsCategoriesUseCase.execute(page);

    const { value } = result;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    return value?.categories.map(CategoryPresenter.toHTTP) ?? [];
  }
}
