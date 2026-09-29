import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { IncreaseInStockUseCase } from '@/domain/application/usecases/increase-in-stock-usecase';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import { ResourceNotFoundError } from '@/domain/application/usecases/errors/resource-not-found-error';
import { QuantityCannotBeLessOrEqualThanZeroError } from '@/domain/enterprise/entities/errors/quantity-cannot-be-less-or-equal-than-zero-error';
import { QuantityCannotBeMoreThanQuantityMaxError } from '@/domain/enterprise/entities/errors/quantity-cannot-be-more-than-quantity-max-error';
import { Public } from '@/infra/auth/public';

const increaseInStockSchemaBody = z.object({
  stockId: z.uuid(),
  quantity: z.number(),
});

type IncreaseInStockSchemaBody = z.infer<typeof increaseInStockSchemaBody>;

const BodyValidation = new ZodValidationPipe(increaseInStockSchemaBody);

@Controller()
export class IncreaseInStockController {
  constructor(private increaseInStockUseCase: IncreaseInStockUseCase) {}

  @Post('/stock/increase')
  @Public()
  async handle(
    @Body(BodyValidation) body: IncreaseInStockSchemaBody,
    //@CurrentUser() user: UserPayload,
  ) {
    const { stockId, quantity } = body;

    //const userId = user.sub;
    const userId = '59181a39-5fb0-4f1e-9a5e-bff940076072';

    const result = await this.increaseInStockUseCase.execute({
      stockId,
      userId,
      quantity,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        case QuantityCannotBeLessOrEqualThanZeroError:
          throw new NotFoundException(error.message);
        case QuantityCannotBeMoreThanQuantityMaxError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return { message: 'success' };
  }
}
