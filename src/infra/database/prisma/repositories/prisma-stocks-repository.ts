import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { StocksRepository } from '@/domain/application/repositories/stocks-repository';
import { PrismaStockMapper } from '../mappers/prisma-stock.mapper';
import { Stock } from '@/domain/enterprise/entities/stock';

const stockInclude = {
  product: {
    include: {
      category: true,
      images: { orderBy: { position: 'asc' } },
    },
  },
} as const;

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

  async delete(stock: Stock): Promise<void> {
    await this.prisma.stock.delete({
      where: {
        id: stock.id.toString(),
      },
    });
  }

  async findById(id: string): Promise<Stock | null> {
    const stock = await this.prisma.stock.findUnique({
      include: stockInclude,
      where: {
        id,
      },
    });

    if (!stock) {
      return null;
    }

    return PrismaStockMapper.toDomain(stock);
  }

  async getStockByProduct(id: string): Promise<Stock | null> {
    const stock = await this.prisma.stock.findUnique({
      include: stockInclude,
      where: {
        product_Id: id,
      },
    });

    if (!stock) {
      return null;
    }

    return PrismaStockMapper.toDomain(stock);
  }
}
