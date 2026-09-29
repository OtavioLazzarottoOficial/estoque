import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Reason,
  StockMovement,
} from '@/domain/enterprise/entities/stockMovement';
import {
  Prisma,
  StockMovement as PrismaStockMovement,
  Reason as PrismaReason,
} from '@/generated/prisma/client';

export class PrismaMovementStockMapper {
  static toDomain(raw: PrismaStockMovement): StockMovement {
    const stockMovementOrError = StockMovement.create(
      {
        productId: new UniqueEntityID(raw.product_Id),
        userId: new UniqueEntityID(raw.user_id),
        stockId: new UniqueEntityID(raw.stock_id),
        quantity: raw.quantity,
        reason: raw.reason as Reason,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    );

    if (stockMovementOrError.isLeft())
      throw new Error(stockMovementOrError.value.message);

    return stockMovementOrError.value;
  }
  static toPrisma(
    stockMovement: StockMovement,
  ): Prisma.StockMovementUncheckedCreateInput {
    return {
      id: stockMovement.id.toString(),
      product_Id: stockMovement.productId.toString(),
      stock_id: stockMovement.stockId.toString(),
      user_id: stockMovement.userId.toString(),
      quantity: stockMovement.quantity,
      reason: stockMovement.reason as unknown as PrismaReason,
      createdAt: stockMovement.createdAt,
    };
  }
}
