import { StocksRepository } from '../../src/domain/application/repositories/stocks-repository';
import { Stock } from '../../src/domain/enterprise/entities/stock';

export class StocksInMemoryRepository implements StocksRepository {
  public items: Stock[] = [];

  async create(stock: Stock): Promise<void> {
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    this.items.push(stock);
  }
  async save(stock: Stock): Promise<void> {
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    const index = this.items.findIndex((item) => item.id === stock.id);

    this.items[index] = stock;
  }

  async delete(stock: Stock): Promise<void> {
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    const index = this.items.findIndex((item) => item.id === stock.id);

    this.items.splice(index, 1);
  }

  async findById(id: string): Promise<Stock | null> {
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    const stock = this.items.find((item) => item.id.toString() === id);

    if (!stock) {
      return null;
    }

    return stock;
  }
}
