import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Order, StatusOrder } from '@/domain/enterprise/entities/order';
import {
  Prisma,
  StatusOrder as PrismaStatusOrder,
} from '@/generated/prisma/client';
import { PrismaItensOrderMapper } from './prisma-itens-order.mapper';

type PrismaOrderWihItensOrder = Prisma.OrderGetPayload<{
  include: { itensOrder: true };
}>;

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrderWihItensOrder) {
    return Order.create(
      {
        userId: new UniqueEntityID(raw.userId),
        status: raw.status as StatusOrder,
        totalAmount: Number(raw.totalAmount),
        items: raw.itensOrder.map(PrismaItensOrderMapper.toDomain),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      userId: order.userId.toString(),
      status: order.status as unknown as PrismaStatusOrder,
      totalAmount: new Prisma.Decimal(order.totalAmount),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
