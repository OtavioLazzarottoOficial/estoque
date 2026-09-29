import { ResourceNotFoundError } from '@/domain/application/usecases/errors/resource-not-found-error';
import { GetByIdProductUseCase } from '@/domain/application/usecases/get-by-id-product-usecase';
import { Public } from '@/infra/auth/public';
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import z from 'zod';
import { ProductPresenter } from '../presenters/product-presenter';

const getByIdProductSchemaParam = z.object({
  id: z.uuid(),
});

type GetByIdProductSchemaParam = z.infer<typeof getByIdProductSchemaParam>;

@Controller()
export class GetByIdProductController {
  constructor(private getByIdProductUseCase: GetByIdProductUseCase) {}

  @Get('/product/:id')
  @Public()
  async handle(@Param() { id }: GetByIdProductSchemaParam) {
    const result = await this.getByIdProductUseCase.execute({ id });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return ProductPresenter.toHttp(result.value.product);
  }
}
