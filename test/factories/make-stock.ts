import { UniqueEntityID } from '../../src/core/entities/unique-entity-id';
import { StockProps, Stock } from '../../src/domain/enterprise/entities/stock';

export function makeStock(
  override: Partial<StockProps> = {},
  id?: UniqueEntityID,
) {
  const stock = Stock.create(
    {
      productId: new UniqueEntityID('product1'),
      quantityMax: 20,
      quantityMin: 5,
      quantityInStock: 5,
      ...override,
    },
    id,
  );

  return stock;
}
