import {
  BadRequestException,
  Controller,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadUserAvatarUseCase } from '@/domain/application/usecases/upload-user-avatar-usecase';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import { UserPresenter } from '../presenters/user-presenter';

@Controller()
export class UploadUserAvatarController {
  constructor(private uploadUserAvatarUseCase: UploadUserAvatarUseCase) {}

  @Patch('/users/me/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async handle(
    @CurrentUser() user: UserPayload,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Avatar file must be provided.');
    }

    const result = await this.uploadUserAvatarUseCase.execute({
      userId: user.sub,
      file: {
        fileName: file.originalname,
        mimeType: file.mimetype,
        body: file.buffer,
      },
    });

    if (result.isLeft()) {
      throw result.value;
    }

    const { user: updatedUser } = result.value;

    return UserPresenter.toHTTP(updatedUser);
  }
}
