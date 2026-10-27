import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Stock } from '@/domain/enterprise/entities/stock';
import { Prisma } from '@/generated/prisma/client';
import { PrismaProductMapper } from './prisma-product.mapper';

type PrismaStockWithProduct = Prisma.StockGetPayload<{
  include: { product: { include: { category: true; images: true } } };
}>;

export class PrismaStockMapper {
  static toDomain(raw: PrismaStockWithProduct): Stock {
    const stockOrError = Stock.create(
      {
        productId: new UniqueEntityID(raw.product_Id),
        quantityInStock: raw.quantityInStock,
        quantityMax: raw.quantityMax,
        quantityMin: raw.quantityMin,
        product: raw.product
          ? PrismaProductMapper.toDomain(raw.product)
          : undefined,
      },
      new UniqueEntityID(raw.id),
    );

    if (stockOrError.isLeft()) {
      throw new Error(stockOrError.value.message);
    }

    return stockOrError.value;
  }

  static toPrisma(stock: Stock): Prisma.StockUncheckedCreateInput {
    return {
      id: stock.id.toValue(),
      product_Id: stock.productId.toValue(),
      quantityInStock: stock.quantityInStock,
      quantityMax: stock.quantityMax,
      quantityMin: stock.quantityMin,
    };
  }
}
