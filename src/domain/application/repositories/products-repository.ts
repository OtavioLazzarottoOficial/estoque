import { Injectable } from '@nestjs/common';
import { Product } from '../../enterprise/entities/product';
import { PaginationParams } from '../../../core/repositories/pagination-params';

@Injectable()
export abstract class ProductsRepository {
  abstract create(product: Product): Promise<void>;
  abstract save(product: Product): Promise<void>;
  abstract delete(product: Product): Promise<void>;
  abstract findById(id: string): Promise<Product | null>;
  abstract findManyRecent(params: PaginationParams): Promise<Product[]>;
}
