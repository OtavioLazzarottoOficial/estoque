import { UniqueEntityID } from '../../src/core/entities/unique-entity-id';
import {
  Product,
  ProductProps,
} from '../../src/domain/enterprise/entities/product';

import { faker } from '@faker-js/faker';
import { SkuObjectValue } from '../../src/domain/enterprise/entities/value-objects/sku-value-object';

export function makeProduct(
  override: Partial<ProductProps> = {},
  id?: UniqueEntityID,
) {
  const product = Product.create(
    {
      sku: SkuObjectValue.create({
        name: faker.commerce.productName(),
        categoryName: faker.book.author(),
      }),
      name: faker.commerce.productName(),
      categoryId: new UniqueEntityID(faker.internet.ip()),
      price: Number(faker.commerce.price()),
      ...override,
    },
    id,
  );
  return product;
}
