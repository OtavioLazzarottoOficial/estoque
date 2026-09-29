import { CreateCategoryUseCase } from '@/domain/application/usecases/create-category-usecase';
import { Public } from '@/infra/auth/public';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { CategoryPresenter } from '../presenters/category-presenter';

const createCategoryBodySchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(3).max(255),
});

type CreateCategoryBody = z.infer<typeof createCategoryBodySchema>;

const BodyValidationSchema = new ZodValidationPipe(createCategoryBodySchema);

@Controller()
export class CreateCategoryController {
  constructor(private createCategoryUseCase: CreateCategoryUseCase) {}

  @Post('/categories')
  @Public()
  async handle(@Body(BodyValidationSchema) body: CreateCategoryBody) {
    const { name, description } = body;

    const result = await this.createCategoryUseCase.execute({
      name,
      description,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value);
    }

    return CategoryPresenter.toHTTP(result.value.category);
  }
}
