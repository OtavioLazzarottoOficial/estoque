import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  StockMovement,
  StockMovementType,
  StockMovementReason,
} from '@/domain/enterprise/entities/stock-movement';
import {
  Prisma,
  StockMovement as PrismaStockMovement,
  StockMovementReason as PrismaStockMovementReason,
  StockMovementType as PrismaStockMovementType,
} from '@/generated/prisma/client';

export class PrismaStockMovementMapper {
  static toDomain(raw: PrismaStockMovement) {
    return StockMovement.create(
      {
        stockId: new UniqueEntityID(raw.StockId),
        reason: raw.reason as unknown as StockMovementReason,
        amount: Number(raw.amount),
        type: raw.type as unknown as StockMovementType,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    stockMovement: StockMovement,
  ): Prisma.StockMovementUncheckedCreateInput {
    return {
      id: stockMovement.id.toString(),
      StockId: stockMovement.stockId.toString(),
      amount: stockMovement.amount,
      reason: stockMovement.reason as unknown as PrismaStockMovementReason,
      type: stockMovement.type as unknown as PrismaStockMovementType,
      createdAt: stockMovement.createdAt,
    };
  }
}
