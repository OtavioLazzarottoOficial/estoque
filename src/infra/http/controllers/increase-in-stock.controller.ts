import { Body, Controller, Post } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { IncreaseInStockUseCase } from '@/domain/application/usecases/increase-in-stock-usecase';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import type { UserPayload } from '@/infra/auth/jwt.strategy';

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
  async handle(
    @Body(BodyValidation) body: IncreaseInStockSchemaBody,
    @CurrentUser() user: UserPayload,
  ) {
    const { stockId, quantity } = body;
    const userId = user.sub;

    const result = await this.increaseInStockUseCase.execute({
      stockId,
      userId,
      quantity,
    });

    if (result.isLeft()) {
      throw result.value;
    }

    return { message: 'success' };
  }
}
