import { PaginationParams } from '@/core/repositories/pagination-params';
import { ProductsRepository } from '@/domain/application/repositories/products-repository';
import { Product } from '@/domain/enterprise/entities/product';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaProductMapper } from '../mappers/prisma-product.mapper';

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private prisma: PrismaService) {}

  async findByName(name: string): Promise<Product | null> {
    const product = await this.prisma.product.findFirst({
      include: { category: true },
      where: { name },
    });

    if (!product) {
      return null;
    }

    return PrismaProductMapper.toDomain(product);
  }

  async create(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product);

    await this.prisma.product.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }

  async save(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product);

    await this.prisma.product.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }

  async delete(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product);
    await this.prisma.product.delete({
      where: { id: data.id },
    });
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      include: { category: true },
      where: {
        id,
      },
    });

    if (!product) {
      return null;
    }

    return PrismaProductMapper.toDomain(product);
  }

  async findManyRecent({ page }: PaginationParams): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      include: { category: true },
      orderBy: {
        createdAt: 'asc',
      },
      skip: (page - 1) * 10,
      take: 10,
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    return products.map(PrismaProductMapper.toDomain);
  }
}
