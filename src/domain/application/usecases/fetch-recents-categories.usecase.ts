import { Either, right } from '@/core/either';
import { Category } from '@/domain/enterprise/entities/category';
import { CategoriesRepository } from '../repositories/categories-repository';
import { Injectable } from '@nestjs/common';

type FetchRecentsCategoriesUseCaseRequest = {
  page: number;
};

type FetchRecentsCategoriesUseCaseResponse = Either<
  null,
  { categories: Category[] }
>;

@Injectable()
export class FetchRecentsCategoriesUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    page,
  }: FetchRecentsCategoriesUseCaseRequest): Promise<FetchRecentsCategoriesUseCaseResponse> {
    const categories = await this.categoriesRepository.findManyRecent({ page });
    return right({ categories });
  }
}
