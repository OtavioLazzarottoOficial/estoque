import {
  BadRequestException,
  Controller,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadProductImagesUseCase } from '@/domain/application/usecases/upload-product-images-usecase';
import { ProductPresenter } from '../presenters/product-presenter';
import { Role } from '@/infra/auth/roles';
import { Roles } from '@/generated/prisma/client';

@Controller()
export class UploadProductImagesController {
  constructor(private uploadProductImagesUseCase: UploadProductImagesUseCase) {}

  @Post('/products/:id/images')
  @Role(Roles.ADMIN, Roles.WAREHOUSE)
  @UseInterceptors(FilesInterceptor('images', 10))
  async handle(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image must be provided.');
    }

    const images = files.map((file) => ({
      fileName: file.originalname,
      mimeType: file.mimetype,
      body: file.buffer,
    }));

    const result = await this.uploadProductImagesUseCase.execute({
      productId: id,
      images,
    });

    if (result.isLeft()) {
      throw result.value;
    }

    const { product } = result.value;

    return ProductPresenter.toHttp(product);
  }
}
