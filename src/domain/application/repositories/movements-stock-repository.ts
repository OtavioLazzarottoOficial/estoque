import { StockMovement } from '@/domain/enterprise/entities/stockMovement';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class MovementsStockRepository {
  abstract create(stockMovement: StockMovement): Promise<void>;
}
