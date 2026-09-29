import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { StocksRepository } from '@/domain/application/repositories/stocks-repository';
import { PrismaStockMapper } from '../mappers/prisma-stock.mapper';
import { Stock } from '@/domain/enterprise/entities/stock';

@Injectable()
export class PrismaStocksRepository implements StocksRepository {
  constructor(private prisma: PrismaService) {}

  async create(stock: Stock): Promise<void> {
    const data = PrismaStockMapper.toPrisma(stock);

    await this.prisma.stock.upsert({
      where: {
        id: data.id,
      },
      create: data,
      update: data,
    });
  }

  async save(stock: Stock): Promise<void> {
    const data = PrismaStockMapper.toPrisma(stock);

    await this.prisma.stock.upsert({
      where: {
        id: data.id,
      },
      create: data,
      update: data,
    });
  }

  delete(stock: Stock): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<Stock | null> {
    const stock = await this.prisma.stock.findUnique({
      where: {
        id,
      },
    });

    if (!stock) {
      return null;
    }

    return PrismaStockMapper.toDomain(stock);
  }
}
