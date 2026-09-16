import { UniqueEntityID } from '../../src/core/entities/unique-entity-id';
import {
  Category,
  CategoryProps,
} from '../../src/domain/enterprise/entities/category';
import { faker } from '@faker-js/faker';

export function makeCategory(
  override: Partial<CategoryProps> = {},
  id?: UniqueEntityID,
) {
  const category = Category.create(
    {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      ...override,
    },
    id,
  );

  return category;
}
