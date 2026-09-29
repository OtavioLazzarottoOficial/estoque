import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Category } from '@/domain/enterprise/entities/category';
import { Category as PrismaCategory, Prisma } from '@/generated/prisma/client';

export class PrismaCategoryMapper {
  static toDomain(raw: PrismaCategory): Category {
    return Category.create(
      {
        name: raw.name,
        description: raw.descriptions,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }
  static toPrisma(category: Category): Prisma.CategoryUncheckedCreateInput {
    return {
      id: category.id.toString(),
      name: category.name,
      descriptions: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt ? category.updatedAt : undefined,
    };
  }
}
