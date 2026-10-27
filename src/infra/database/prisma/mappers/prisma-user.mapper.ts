import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';
import {
  Roles as RolesDomain,
  User,
} from '../../../../domain/enterprise/entities/user';
import { EmailValueObject } from '../../../../domain/enterprise/entities/value-objects/email-value-object';
import { ImageFile } from '../../../../domain/enterprise/entities/value-objects/image-file';
import { PasswordValueObject } from '../../../../domain/enterprise/entities/value-objects/password-value-object';
import {
  Prisma,
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
        avatar: raw.avatarStorageKey
          ? ImageFile.restore({
              storageKey: raw.avatarStorageKey,
              url: raw.avatarUrl ?? raw.avatarStorageKey,
              originalName: raw.avatarOriginalName ?? '',
              mimeType: raw.avatarMimeType ?? 'image/jpeg',
              size: raw.avatarSize ?? 0,
            })
          : null,
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
      role: user.role,
      avatarStorageKey: user.avatar ? user.avatar.storageKey : null,
      avatarUrl: user.avatar ? user.avatar.url : null,
      avatarOriginalName: user.avatar ? user.avatar.originalName : null,
      avatarMimeType: user.avatar ? user.avatar.mimeType : null,
      avatarSize: user.avatar ? user.avatar.size : null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt ? user.updatedAt : undefined,
    };
  }
}
