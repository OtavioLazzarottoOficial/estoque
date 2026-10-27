import { Controller, Param, Patch } from '@nestjs/common';
import { SetMainProductImageUseCase } from '@/domain/application/usecases/set-main-product-image-usecase';
import { ProductPresenter } from '../presenters/product-presenter';
import { Role } from '@/infra/auth/roles';
import { Roles } from '@/generated/prisma/client';

@Controller()
export class SetMainProductImageController {
  constructor(private setMainProductImageUseCase: SetMainProductImageUseCase) {}

  @Patch('/products/:id/images/:imageId/main')
  @Role(Roles.ADMIN, Roles.WAREHOUSE)
  async handle(
    @Param('id') productId: string,
    @Param('imageId') imageId: string,
  ) {
    const result = await this.setMainProductImageUseCase.execute({
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
