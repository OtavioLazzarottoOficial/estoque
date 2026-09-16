import { Injectable } from '@nestjs/common';
import { Either, right } from '../../../core/either';
import { CategoriesRepository } from '../repositories/categories-repository';
import { Category } from '../../enterprise/entities/category';

type CreateCategoryUseCaseRequestDTO = {
  name: string;
  description: string;
};

type CreateCategoryUseCaseResponse = Either<
  null,
  {
    category: Category;
  }
>;

@Injectable()
export class CreateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    name,
    description,
  }: CreateCategoryUseCaseRequestDTO): Promise<CreateCategoryUseCaseResponse> {
    const category = Category.create({
      name,
      description,
    });

    await this.categoriesRepository.create(category);

    return right({ category });
  }
}
