import { PaginationParams } from '../../../../core/repositories/pagination-params';
import { UsersRepository } from '../../../../domain/application/repositories/users-repository';
import { User } from '../../../../domain/enterprise/entities/user';
import { PrismaUserMapper } from '../mappers/prisma-user.mapper';
import { PrismaService } from '../prisma.service';

export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}
  save(user: User): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(user: User): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findManyRecent(params: PaginationParams): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }
}
