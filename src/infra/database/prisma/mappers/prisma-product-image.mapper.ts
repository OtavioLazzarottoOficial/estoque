import {
  Prisma,
  ProductImage as PrismaProductImage,
} from '@/generated/prisma/client';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Product } from '@/domain/enterprise/entities/product';
import { ProductImage } from '@/domain/enterprise/entities/product-image';
import { ImageFile } from '@/domain/enterprise/entities/value-objects/image-file';

export class PrismaProductImageMapper {
  static toDomain(raw: PrismaProductImage): ProductImage {
    return ProductImage.create(
      {
        file: ImageFile.restore({
          storageKey: raw.storageKey,
          url: raw.url as string,
          originalName: raw.originalName,
          mimeType: raw.mimeType,
          size: raw.size,
        }),
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrismaMany(product: Product): Prisma.ProductImageCreateManyInput[] {
    return product.images.map((image, index) => ({
      id: image.id.toString(),
      productId: product.id.toString(),
      storageKey: image.storageKey,
      url: image.file.url,
      originalName: image.file.originalName,
      mimeType: image.file.mimeType,
      size: image.file.size,
      position: index, // a ordem do array é a fonte da verdade
      createdAt: image.createdAt,
    }));
  }
}
