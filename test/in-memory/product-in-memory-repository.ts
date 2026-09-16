import { PaginationParams } from '../../src/core/repositories/pagination-params';
import { ProductsRepository } from '../../src/domain/application/repositories/products-repository';
import { Product } from '../../src/domain/enterprise/entities/product';

export class ProductInMemoryRepository implements ProductsRepository {
  public items: Product[] = [];

  async create(product: Product): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0));

    this.items.push(product);
  }

  async save(product: Product): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0));

    const index = this.items.findIndex((item) => item.id === product.id);

    this.items[index] = product;
  }

  async delete(product: Product): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const itemIdex = this.items.findIndex((item) => item.id === product.id);

    this.items.splice(itemIdex, 1);
  }
  async findById(id: string): Promise<Product | null> {
    await new Promise((resolve) => setTimeout(resolve, 0));

    const product = this.items.find((item) => item.id.toString() === id);

    if (!product) {
      return null;
    }

    return product;
  }
  async findManyRecent({ page }: PaginationParams): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const product = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return product;
  }
}
