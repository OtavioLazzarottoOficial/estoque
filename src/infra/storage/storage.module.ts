import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';
import { FileStorage } from '@/domain/application/storage/file-storage';
import { LocalFileStorage } from './local-file-storage';
import { R2FileStorage } from './r2-file-storage';
import { ImageUploader } from '@/domain/application/services/image-uploader';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: FileStorage,
      inject: [EnvService],
      useFactory: (envService: EnvService): FileStorage => {
        if (envService.get('STORAGE_DRIVER') === 'r2') {
          return new R2FileStorage(envService);
        }

        return new LocalFileStorage(envService);
      },
    },
    ImageUploader,
  ],
  exports: [FileStorage, ImageUploader],
})
export class StorageModule {}
