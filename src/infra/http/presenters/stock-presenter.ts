import { Stock } from '@/domain/enterprise/entities/stock';

export class StockPresenter {
  static toHttp(stock: Stock) {
    return {
      id: stock.id.toString(),
      productId: stock.productId.toString(),
      quantityInStock: stock.quantityInStock,
      quantityMax: stock.quantityMax,
      quantityMin: stock.quantityMin,
      createdAt: stock.createdAt,
      updatedAt: stock.updatedAt,
    };
  }
}
