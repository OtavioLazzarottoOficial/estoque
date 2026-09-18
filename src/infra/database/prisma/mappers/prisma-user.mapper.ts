import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Roles, User } from '@/domain/enterprise/entities/user';
import { Prisma, User as PrismaUser } from '@/generated/prisma/client';

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser) {
    return User.create(
      {
        name: raw.name,
        username: raw.username,
        password: raw.password,
        roles: raw.role as Roles,
        active: raw.active,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      username: user.username,
      password: user.password,
      role: user.roles,
      active: user.active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
