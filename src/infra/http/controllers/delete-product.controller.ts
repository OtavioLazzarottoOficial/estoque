import z from 'zod';
import { DeleteProductUseCase } from '@/domain/application/usecases/delete-product-usecase';
import {
  BadRequestException,
  Controller,
  Delete,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ResourceNotFoundError } from '@/domain/application/usecases/errors/resource-not-found-error';
import { ProductPresenter } from '../presenters/product-presenter';
import { Public } from '@/infra/auth/public';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteProductSchemaParams = z.object({
  id: z.uuid(),
});

type DeleteProductSchemaParams = z.infer<typeof deleteProductSchemaParams>;

@Controller()
@Public()
export class DeleteProductController {
  constructor(private deleteProductUseCase: DeleteProductUseCase) {}

  @Delete('/product/delete/:id')
  async handle(@Param() { id }: DeleteProductSchemaParams) {
    const result = await this.deleteProductUseCase.execute({ id });

    if (result.isLeft()) {
      const errors = result.value;
      switch (errors.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(errors.message);
        default:
          throw new BadRequestException(errors.message);
      }
    }

    const product = result.value.product;

    return ProductPresenter.toHttp(product);
  }
}
