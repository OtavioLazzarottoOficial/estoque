import { User } from '@/domain/enterprise/entities/user';

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
        ? {
            url: user.avatar.url,
            storageKey: user.avatar.storageKey,
            originalName: user.avatar.originalName,
            mimeType: user.avatar.mimeType,
            size: user.avatar.size,
          }
        : null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
