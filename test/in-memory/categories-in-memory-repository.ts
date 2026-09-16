import { PaginationParams } from '../../src/core/repositories/pagination-params';
import { CategoriesRepository } from '../../src/domain/application/repositories/categories-repository';
import { Category } from '../../src/domain/enterprise/entities/category';

export class CategoriesInMemoryRepository implements CategoriesRepository {
  public items: Category[] = [];

  async create(category: Category): Promise<void> {
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    this.items.push(category);
  }
  async save(category: Category): Promise<void> {
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    const index = this.items.findIndex((item) => item.id === category.id);

    this.items[index] = category;
  }

  async delete(category: Category): Promise<void> {
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  }
  async findById(id: string): Promise<Category | null> {
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    const category = this.items.find((item) => item.id.toString() === id);

    if (!category) {
      return null;
    }

    return category;
  }

  async findManyRecent(params: PaginationParams): Promise<Category[]> {
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  }
}
