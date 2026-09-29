/* eslint-disable @typescript-eslint/no-unsafe-call */
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Product, Status } from '@/domain/enterprise/entities/product';
import { SkuObjectValue } from '@/domain/enterprise/entities/value-objects/sku-value-object';
import { Prisma } from '@/generated/prisma/client';
import { PrismaCategoryMapper } from './prisma-category.mapper';

type PrismaProductWithCategory = Prisma.ProductGetPayload<{
  include: {
    category: true;
  };
}>;

export class PrismaProductMapper {
  static toDomain(raw: PrismaProductWithCategory): Product {
    const productOrError = Product.create(
      {
        categoryId: new UniqueEntityID(raw.category_Id),
        name: raw.name,
        description: raw.description,
        price: raw.price,
        sku: SkuObjectValue.createFromDB(raw.sku),
        status: raw.status as Status,
        category: raw.category
          ? PrismaCategoryMapper.toDomain(raw.category)
          : undefined,
      },
      new UniqueEntityID(raw.id),
    );

    if (productOrError.isLeft()) {
      throw new Error(productOrError.value.message);
    }

    return productOrError.value;
  }

  static toPrisma(product: Product): Prisma.ProductUncheckedCreateInput {
    return {
      id: product.id.toValue(),
      category_Id: product.categoryId.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      sku: product.sku,
      status: product.status,
    };
  }
}
