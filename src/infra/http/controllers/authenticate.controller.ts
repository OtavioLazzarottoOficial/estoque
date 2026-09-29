import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { AuthenticateUseCase } from '@/domain/application/usecases/authenticate-usecase';
import { Public } from '@/infra/auth/public';
import { ResourceNotFoundError } from '@/domain/application/usecases/errors/resource-not-found-error';

const authenticateSchemaBody = z.object({
  email: z.email('Invalid email address'),
  password: z.string(),
});

type AuthenticateSchemaBody = z.infer<typeof authenticateSchemaBody>;

const BodySchemaValidation = new ZodValidationPipe(authenticateSchemaBody);

@Controller()
export class AuthenticateController {
  constructor(private authenticateUseCase: AuthenticateUseCase) {}

  @Post('/auth')
  @Public()
  async handle(@Body(BodySchemaValidation) body: AuthenticateSchemaBody) {
    const { email, password } = body;

    console.log('AuthenticateController.handle', { email, password });

    const result = await this.authenticateUseCase.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { access_token } = result.value;

    return { access_token };
  }
}
