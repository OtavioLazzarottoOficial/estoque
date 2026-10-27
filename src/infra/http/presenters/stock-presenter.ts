import { Stock } from '@/domain/enterprise/entities/stock';

export class StockPresenter {
  static toHttp(stock: Stock) {
    return {
      id: stock.id.toString(),
      productId: stock.productId.toString(),
      quantityInStock: stock.quantityInStock,
      quantityMax: stock.quantityMax,
      quantityMin: stock.quantityMin,
      product: stock.product
        ? {
            id: stock.product.id.toString(),
            name: stock.product.name,
            images: stock.product.images,
          }
        : null,
      createdAt: stock.createdAt,
      updatedAt: stock.updatedAt,
    };
  }
}
