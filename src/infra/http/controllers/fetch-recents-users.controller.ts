import { FetchRecentsUsersUseCase } from '@/domain/application/usecases/fetch-recents-users.usecase';
import { Controller, Get, Query } from '@nestjs/common';
import z from 'zod';
import { UserPresenter } from '../presenters/user-presenter';
import { Public } from '@/infra/auth/public';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const fetchRecentsUsersSchemaParams = z.object({
  page: z.coerce.number().default(1),
});

type FetchRecentsUsersSchemaParams = z.infer<
  typeof fetchRecentsUsersSchemaParams
>;

const queryValidation = new ZodValidationPipe(fetchRecentsUsersSchemaParams);

@Controller()
export class FetchRecentsUsersController {
  constructor(private fetchRecentsUsersUseCase: FetchRecentsUsersUseCase) {}

  @Get('/users')
  @Public()
  async handle(@Query(queryValidation) page: FetchRecentsUsersSchemaParams) {
    const result = await this.fetchRecentsUsersUseCase.execute(page);

    const { value } = result;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    return value?.users.map(UserPresenter.toHTTP) ?? [];
  }
}
