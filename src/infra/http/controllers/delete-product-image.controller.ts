import { Controller, Delete, Param } from '@nestjs/common';
import { DeleteProductImageUseCase } from '@/domain/application/usecases/delete-product-image-usecase';
import { ProductPresenter } from '../presenters/product-presenter';
import { Role } from '@/infra/auth/roles';
import { Roles } from '@/generated/prisma/client';

@Controller()
export class DeleteProductImageController {
  constructor(private deleteProductImageUseCase: DeleteProductImageUseCase) {}

  @Delete('/products/:id/images/:imageId')
  @Role(Roles.ADMIN, Roles.WAREHOUSE)
  async handle(
    @Param('id') productId: string,
    @Param('imageId') imageId: string,
  ) {
    const result = await this.deleteProductImageUseCase.execute({
      productId,
      imageId,
    });

    if (result.isLeft()) {
      throw result.value;
    }

    const { product } = result.value;

    return ProductPresenter.toHttp(product);
  }
}
