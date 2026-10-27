import { Status } from '@/domain/enterprise/entities/product';
import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { CreateProductUseCase } from '@/domain/application/usecases/create-product-usecase';
import { ProductPresenter } from '../presenters/product-presenter';
import { Role } from '@/infra/auth/roles';
import { Roles } from '@/generated/prisma/client';

const createProductSchemaBody = z.object({
  name: z.string(),
  description: z.string(),
  price: z.coerce.number(),
  categoryId: z.string().uuid(),
  status: z.enum(Status).optional(),
});

type CreateProductSchemaBody = z.infer<typeof createProductSchemaBody>;

const bodyValidation = new ZodValidationPipe(createProductSchemaBody);

@Controller()
export class CreateProductController {
  constructor(private createProductUseCase: CreateProductUseCase) {}

  @Post('/product')
  @Role(Roles.ADMIN, Roles.WAREHOUSE)
  @UseInterceptors(FilesInterceptor('images', 10))
  async handle(
    @Body(bodyValidation) body: CreateProductSchemaBody,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const { name, description, price, categoryId, status } = body;

    const images =
      files?.map((file) => ({
        fileName: file.originalname,
        mimeType: file.mimetype,
        body: file.buffer,
      })) ?? [];

    const result = await this.createProductUseCase.execute({
      name,
      description,
      price,
      categoryId,
      status,
      images,
    });

    if (result.isLeft()) {
      throw result.value;
    }

    const { product } = result.value;

    return ProductPresenter.toHttp(product);
  }
}
