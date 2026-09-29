import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import { ResourceNotFoundError } from '@/domain/application/usecases/errors/resource-not-found-error';
import { QuantityCannotBeLessOrEqualThanZeroError } from '@/domain/enterprise/entities/errors/quantity-cannot-be-less-or-equal-than-zero-error';
import { Public } from '@/infra/auth/public';
import { DecreaseInStockUseCase } from '@/domain/application/usecases/decrease-in-stock-usecase';
import { QuantityCannotBeLessThanQuantityMinError } from '@/domain/enterprise/entities/errors/quantity-cannot-be-less-than-quantity-min-error';

const decreaseInStockSchemaBody = z.object({
  stockId: z.uuid(),
  quantity: z.number(),
});

type DecreaseInStockSchemaBody = z.infer<typeof decreaseInStockSchemaBody>;

const BodyValidation = new ZodValidationPipe(decreaseInStockSchemaBody);

@Controller()
export class DecreaseInStockController {
  constructor(private decreaseInStockUseCase: DecreaseInStockUseCase) {}

  @Post('/stock/decrease')
  @Public()
  async handle(
    @Body(BodyValidation) body: DecreaseInStockSchemaBody,
    //@CurrentUser() user: UserPayload,
  ) {
    const { stockId, quantity } = body;

    //const userId = user.sub;
    const userId = '59181a39-5fb0-4f1e-9a5e-bff940076072';

    const result = await this.decreaseInStockUseCase.execute({
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
        case QuantityCannotBeLessThanQuantityMinError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return { message: 'success' };
  }
}
