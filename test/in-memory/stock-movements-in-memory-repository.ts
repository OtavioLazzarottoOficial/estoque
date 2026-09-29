import { MovementsStockRepository } from '@/domain/application/repositories/movements-stock-repository';
import { StockMovement } from '@/domain/enterprise/entities/stockMovement';

export class MovementsStockInMemoryRepository implements MovementsStockRepository {
  public items: StockMovement[] = [];

  async create(stockMovement: StockMovement) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    this.items.push(stockMovement);
  }
}
