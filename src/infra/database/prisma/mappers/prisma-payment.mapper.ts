import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Payment, PaymentType } from '@/domain/enterprise/entities/payment';
import {
  Prisma,
  Payment as PrismaPayment,
  PaymentType as PrismaPaymentType,
} from '@/generated/prisma/client';

export class PrismaPaymentMapper {
  static toDomain(raw: PrismaPayment) {
    return Payment.create(
      {
        orderId: new UniqueEntityID(raw.orderId),
        price: Number(raw.price),
        typePayment: raw.paymentType as PaymentType,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(payment: Payment): Prisma.PaymentUncheckedCreateInput {
    return {
      id: payment.id.toString(),
      orderId: payment.orderId.toString(),
      price: payment.price,
      paymentType: payment.typePayment as unknown as PrismaPaymentType,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}
