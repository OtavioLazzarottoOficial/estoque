import { PaginationParams } from '@/core/repositories/pagination-params';
import { CategoriesRepository } from '@/domain/application/repositories/categories-repository';
import { Category } from '@/domain/enterprise/entities/category';
import { PrismaService } from '../prisma.service';
import { PrismaCategoryMapper } from '../mappers/prisma-category.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaCategoriesRepository implements CategoriesRepository {
  constructor(private prisma: PrismaService) {}

  async create(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPrisma(category);

    await this.prisma.category.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async save(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPrisma(category);

    await this.prisma.category.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async delete(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPrisma(category);

    await this.prisma.category.delete({
      where: { id: data.id },
    });
  }
  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return null;
    }

    return PrismaCategoryMapper.toDomain(category);
  }
  async findManyRecent({ page }: PaginationParams): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      skip: (page - 1) * 10,
      take: 10,
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    return categories.map(PrismaCategoryMapper.toDomain);
  }
}
