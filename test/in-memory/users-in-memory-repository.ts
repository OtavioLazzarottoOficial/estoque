import { PaginationParams } from '../../src/core/repositories/pagination-params';
import { UsersRepository } from '../../src/domain/application/repositories/users-repository';
import { User } from '../../src/domain/enterprise/entities/user';

export class UsersInMemoryRepository implements UsersRepository {
  public items: User[] = [];

  async create(user: User): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0));

    this.items.push(user);
  }

  async save(user: User): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0));

    const index = this.items.findIndex((item) => item.id === user.id);

    this.items[index] = user;
  }

  async delete(user: User): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const itemIdex = this.items.findIndex((item) => item.id === user.id);

    this.items.splice(itemIdex, 1);
  }
  async findById(id: string): Promise<User | null> {
    await new Promise((resolve) => setTimeout(resolve, 0));

    const user = this.items.find((item) => item.id.toString() === id);

    if (!user) {
      return null;
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    await new Promise((resolve) => setTimeout(resolve, 0));

    const user = this.items.find((item) => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }
  async findManyRecent({ page }: PaginationParams): Promise<User[]> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const users = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return users;
  }
}
