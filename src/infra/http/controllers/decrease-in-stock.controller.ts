import { Body, Controller, Post } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import { DecreaseInStockUseCase } from '@/domain/application/usecases/decrease-in-stock-usecase';

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
  async handle(
    @Body(BodyValidation) body: DecreaseInStockSchemaBody,
    @CurrentUser() user: UserPayload,
  ) {
    const { stockId, quantity } = body;
    const userId = user.sub;

    const result = await this.decreaseInStockUseCase.execute({
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
