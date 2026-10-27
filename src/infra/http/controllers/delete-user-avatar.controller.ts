import { Controller, Delete } from '@nestjs/common';
import { DeleteUserAvatarUseCase } from '@/domain/application/usecases/delete-user-avatar-usecase';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import { UserPresenter } from '../presenters/user-presenter';

@Controller()
export class DeleteUserAvatarController {
  constructor(private deleteUserAvatarUseCase: DeleteUserAvatarUseCase) {}

  @Delete('/users/me/avatar')
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.deleteUserAvatarUseCase.execute({
      userId: user.sub,
    });

    if (result.isLeft()) {
      throw result.value;
    }

    const { user: updatedUser } = result.value;

    return UserPresenter.toHTTP(updatedUser);
  }
}
