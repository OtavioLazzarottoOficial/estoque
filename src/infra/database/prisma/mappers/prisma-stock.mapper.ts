import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Stock } from '@/domain/enterprise/entities/stock';
import { Prisma } from '@/generated/prisma/client';
import { PrismaProductMapper } from './prisma-product.mapper';

type PrismaStockWihProduct = Prisma.StockGetPayload<{
  include: { product: true };
}>;

export class PrismaStockMapper {
  static toDomain(raw: PrismaStockWihProduct) {
    return Stock.create(
      {
        productId: new UniqueEntityID(raw.productId),
        quantity: raw.quantity,
        minimumQuantity: raw.minimumQuantity,
        product: raw.product
          ? PrismaProductMapper.toDomain(raw.product)
          : undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(stock: Stock): Prisma.StockUncheckedCreateInput {
    return {
      id: stock.id.toString(),
      quantity: stock.quantity,
      minimumQuantity: Number(stock.minimumQuantity),
      productId: stock.productId.toString(),
      createdAt: stock.createdAt,
      updatedAt: stock.updatedAt,
    };
  }
}
