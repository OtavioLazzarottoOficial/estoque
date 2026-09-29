import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MovementsStockRepository } from '@/domain/application/repositories/movements-stock-repository';
import { PrismaMovementStockMapper } from '../mappers/prisma-movement-stock.mapper';
import { StockMovement } from '@/domain/enterprise/entities/stockMovement';

@Injectable()
export class PrismaMovementsStockRepository implements MovementsStockRepository {
  constructor(private prisma: PrismaService) {}

  async create(stockMovement: StockMovement): Promise<void> {
    const data = PrismaMovementStockMapper.toPrisma(stockMovement);

    await this.prisma.stockMovement.upsert({
      where: {
        id: data.id,
      },
      create: data,
      update: data,
    });
  }
}
