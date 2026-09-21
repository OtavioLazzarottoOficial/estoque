import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';
import {
  Roles as RolesDomain,
  User,
} from '../../../../domain/enterprise/entities/user';
import { EmailValueObject } from '../../../../domain/enterprise/entities/value-objects/email-value-object';
import { PasswordValueObject } from '../../../../domain/enterprise/entities/value-objects/password-value-object';
import {
  Prisma,
  Roles,
  User as PrismaUser,
} from '../../../../generated/prisma/client';

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser) {
    return User.create(
      {
        name: raw.name,
        email: EmailValueObject.createFromBD(raw.email),
        password: PasswordValueObject.createFromHash(raw.password),
        role: raw.role as RolesDomain,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,

      role: user.role as unknown as Roles,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt ? user.updatedAt : undefined,
    };
  }
}
