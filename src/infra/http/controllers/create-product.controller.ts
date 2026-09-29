import { Status } from '@/domain/enterprise/entities/product';
import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { CreateProductUseCase } from '@/domain/application/usecases/create-product-usecase';
import { Public } from '@/infra/auth/public';
import { ResourceNotFoundError } from '@/domain/application/usecases/errors/resource-not-found-error';
import { QuantityCannotBeLessThanZeroError } from '@/domain/enterprise/entities/errors/quantity-cannot-be-less-than-zero-error';
import { ProductPresenter } from '../presenters/product-presenter';

const createProductSchemaBody = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  categoryId: z.uuid(),
  status: z.enum(Status).optional(),
});

type CreateProductSchemaBody = z.infer<typeof createProductSchemaBody>;

const bodyValidation = new ZodValidationPipe(createProductSchemaBody);

@Controller()
export class CreateProductController {
  constructor(private createProductUseCase: CreateProductUseCase) {}

  @Post('/product')
  @Public()
  async handle(@Body(bodyValidation) body: CreateProductSchemaBody) {
    const { name, description, price, categoryId, status } = body;

    const result = await this.createProductUseCase.execute({
      name,
      description,
      price,
      categoryId,
      status,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        case QuantityCannotBeLessThanZeroError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { product } = result.value;

    return ProductPresenter.toHttp(product);
  }
}
