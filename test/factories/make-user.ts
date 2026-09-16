import { UniqueEntityID } from '../../src/core/entities/unique-entity-id';
import {
  Roles,
  User,
  UserProps,
} from '../../src/domain/enterprise/entities/user';

import { faker } from '@faker-js/faker';
import { EmailValueObject } from '../../src/domain/enterprise/entities/value-objects/email-value-object';
import { PasswordValueObject } from '../../src/domain/enterprise/entities/value-objects/password-value-object';

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.create(
    {
      name: faker.internet.displayName(),
      email: EmailValueObject.createFromBD(faker.internet.email()),
      password: PasswordValueObject.createFromHash(
        faker.internet.password({ length: 8, memorable: true }),
      ),
      role: Roles.ADMIN,
      ...override,
    },
    id,
  );

  return user;
}
