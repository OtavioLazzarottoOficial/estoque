import { Injectable } from '@nestjs/common';
import { PaginationParams } from '../../../core/repositories/pagination-params';
import { Category } from '../../enterprise/entities/category';

@Injectable()
export abstract class CategoriesRepository {
  abstract create(category: Category): Promise<void>;
  abstract save(category: Category): Promise<void>;
  abstract delete(category: Category): Promise<void>;
  abstract findById(id: string): Promise<Category | null>;
  abstract findManyRecent(params: PaginationParams): Promise<Category[]>;
}
