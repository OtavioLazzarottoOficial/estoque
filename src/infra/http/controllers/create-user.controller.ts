import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common';
import z from 'zod';
import { Roles } from '../../../domain/enterprise/entities/user';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { CreateUserUseCase } from '../../../domain/application/usecases/create-user-usecase';
import { InvalidPasswordError } from '../../../domain/enterprise/entities/value-objects/errors/invalid-password-error';
import { EmailInvalidError } from '../../../domain/enterprise/entities/value-objects/errors/email-invalid-error';
import { ExistUserWithThisEmailError } from '../../../domain/application/usecases/errors/exist-user-with-this-email-error';
import { Public } from '@/infra/auth/public';
import { UserPresenter } from '../presenters/user-presenter';

const createUserBodySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(Roles),
});

type CreateUserBody = z.infer<typeof createUserBodySchema>;

const BodySchemaValidation = new ZodValidationPipe(createUserBodySchema);

@Controller()
export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}
  @Post('/users')
  @Public()
  async handle(@Body(BodySchemaValidation) body: CreateUserBody) {
    const { name, email, password, role } = body;
    const result = await this.createUserUseCase.execute({
      name,
      email,
      password,
      role,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidPasswordError:
          throw new NotFoundException(error.message);
        case EmailInvalidError:
          throw new NotFoundException(error.message);
        case ExistUserWithThisEmailError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { user } = result.value;

    return UserPresenter.toHTTP(user);
  }
}
