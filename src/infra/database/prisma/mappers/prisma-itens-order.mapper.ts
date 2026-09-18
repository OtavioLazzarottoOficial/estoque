import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ItensOrder } from '@/domain/enterprise/entities/itens-order';
import {
  Prisma,
  ItensOrder as PrismaItensOrder,
} from '@/generated/prisma/client';

export class PrismaItensOrderMapper {
  static toDomain(raw: PrismaItensOrder) {
    return ItensOrder.create(
      {
        productId: new UniqueEntityID(raw.productId),
        orderId: new UniqueEntityID(raw.orderId),
        quantity: Number(raw.quantity),
        priceTotal: Number(raw.priceTotal),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    itensOrder: ItensOrder,
  ): Prisma.ItensOrderUncheckedCreateInput {
    return {
      id: itensOrder.id.toString(),
      productId: itensOrder.productId.toString(),
      orderId: itensOrder.orderId.toString(),
      quantity: itensOrder.quantity,
      priceTotal: itensOrder.priceTotal,
      createdAt: itensOrder.createdAt,
      updatedAt: itensOrder.updatedAt,
    };
  }
}
