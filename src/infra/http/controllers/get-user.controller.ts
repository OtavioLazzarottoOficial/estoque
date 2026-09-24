import { Controller, Get } from '@nestjs/common';

import { CreateUserUseCase } from '../../../domain/application/usecases/create-user-usecase';
import { Public } from '@/infra/auth/public';

@Controller()
export class GetUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}
  @Get('/users')
  @Public()
  handle() {
    return 'Hello World';
  }
}
