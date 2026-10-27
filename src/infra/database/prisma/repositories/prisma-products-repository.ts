import { PaginationParams } from '@/core/repositories/pagination-params';
import { ProductsRepository } from '@/domain/application/repositories/products-repository';
import { Product } from '@/domain/enterprise/entities/product';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '../prisma.service';
import { PrismaProductMapper } from '../mappers/prisma-product.mapper';
import { PrismaProductImageMapper } from '../mappers/prisma-product-image.mapper';

const productInclude = {
  category: true,
  images: { orderBy: { position: 'asc' } },
} satisfies Prisma.ProductInclude;

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private prisma: PrismaService) {}

  async findByName(name: string): Promise<Product | null> {
    const product = await this.prisma.product.findFirst({
      include: productInclude,
      where: { name },
    });

    if (!product) {
      return null;
    }

    return PrismaProductMapper.toDomain(product);
  }

  async create(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product);
    const images = PrismaProductImageMapper.toPrismaMany(product);

    await this.prisma.$transaction([
      this.prisma.product.create({ data }),
      this.prisma.productImage.createMany({ data: images }),
    ]);
  }

  async save(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product);
    const images = PrismaProductImageMapper.toPrismaMany(product);

    await this.prisma.$transaction([
      this.prisma.product.update({ where: { id: data.id }, data }),
      // apaga antes de recriar: evita violar o @@unique([productId, position])
      this.prisma.productImage.deleteMany({ where: { productId: data.id } }),
      this.prisma.productImage.createMany({ data: images }),
    ]);
  }

  async delete(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product);

    // as linhas de ProductImage saem por cascade
    await this.prisma.product.delete({ where: { id: data.id } });
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      include: productInclude,
      where: { id },
    });

    if (!product) {
      return null;
    }

    return PrismaProductMapper.toDomain(product);
  }

  async findManyRecent({ page }: PaginationParams): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      include: productInclude,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * 10,
      take: 10,
    });

    return products.map((product) => PrismaProductMapper.toDomain(product));
  }
}
