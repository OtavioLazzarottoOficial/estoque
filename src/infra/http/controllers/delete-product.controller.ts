import z from 'zod';
import { DeleteProductUseCase } from '@/domain/application/usecases/delete-product-usecase';
import { Controller, Delete, Param } from '@nestjs/common';
import { ProductPresenter } from '../presenters/product-presenter';
import { Role } from '@/infra/auth/roles';
import { Roles } from '@/generated/prisma/client';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteProductSchemaParams = z.object({
  id: z.uuid(),
});

type DeleteProductSchemaParams = z.infer<typeof deleteProductSchemaParams>;

@Controller()
export class DeleteProductController {
  constructor(private deleteProductUseCase: DeleteProductUseCase) {}

  @Delete('/product/delete/:id')
  @Role(Roles.ADMIN)
  async handle(@Param() { id }: DeleteProductSchemaParams) {
    const result = await this.deleteProductUseCase.execute({ id });

    if (result.isLeft()) {
      throw result.value;
    }

    const product = result.value.product;

    return ProductPresenter.toHttp(product);
  }
}
