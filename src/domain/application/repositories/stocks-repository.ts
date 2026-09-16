import { Injectable } from '@nestjs/common';
import { Stock } from '../../enterprise/entities/stock';

@Injectable()
export abstract class StocksRepository {
  abstract create(stock: Stock): Promise<void>;
  abstract save(stock: Stock): Promise<void>;
  abstract delete(stock: Stock): Promise<void>;
  abstract findById(id: string): Promise<Stock | null>;
}
