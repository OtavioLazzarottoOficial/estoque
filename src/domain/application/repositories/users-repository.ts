import { Injectable } from '@nestjs/common';
import { PaginationParams } from '../../../core/repositories/pagination-params';
import { User } from '../../enterprise/entities/user';

@Injectable()
export abstract class UsersRepository {
  abstract create(user: User): Promise<void>;
  abstract save(user: User): Promise<void>;
  abstract delete(user: User): Promise<void>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findManyRecent(params: PaginationParams): Promise<User[]>;
}
