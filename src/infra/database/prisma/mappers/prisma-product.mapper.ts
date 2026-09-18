import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Product } from '@/domain/enterprise/entities/product';
import { Prisma, Product as PrismaProduct } from '@/generated/prisma/client';

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct) {
    return Product.create(
      {
        name: raw.name,
        price: Number(raw.price),
        description: raw.description,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(produt: Product): Prisma.ProductUncheckedCreateInput {
    return {
      id: produt.id.toString(),
      name: produt.name,
      price: produt.price,
      description: produt.description,
      createdAt: produt.createdAt,
      updatedAt: produt.updatedAt,
    };
  }
}
