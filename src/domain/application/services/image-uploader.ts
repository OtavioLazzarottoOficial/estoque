import { Either, left, right } from '@/core/either';
import { ImageTooLargeError } from '@/domain/enterprise/entities/value-objects/errors/image-too-large.error';
import { InvalidImageMimeTypeError } from '@/domain/enterprise/entities/value-objects/errors/invalid-image-mime-type.error';
import {
  ImageFile,
  ImagePolicy,
} from '@/domain/enterprise/entities/value-objects/image-file';
import { randomUUID } from 'node:crypto';
import { FileStorage } from '../storage/file-storage';
import { Injectable } from '@nestjs/common';

export type ImageInput = {
  fileName: string;
  mimeType: string;
  body: Buffer;
};

export type PreparedImage = {
  file: ImageFile;
  body: Buffer;
};

const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

@Injectable()
export class ImageUploader {
  constructor(private fileStorage: FileStorage) {}

  // sem I/O: só valida e monta as chaves
  prepare(
    inputs: ImageInput[],
    options: { folder: string; policy: ImagePolicy },
  ): Either<InvalidImageMimeTypeError | ImageTooLargeError, PreparedImage[]> {
    const prepared: PreparedImage[] = [];

    for (const input of inputs) {
      const ext = EXTENSION_BY_MIME[input.mimeType] ?? 'bin';
      const storageKey = `${options.folder}/${randomUUID()}.${ext}`;

      const fileOrError = ImageFile.create(
        {
          storageKey,
          url: this.fileStorage.getPublicUrl(storageKey),
          originalName: input.fileName,
          mimeType: input.mimeType,
          size: input.body.byteLength,
        },
        options.policy,
      );
      if (fileOrError.isLeft()) return left(fileOrError.value);

      prepared.push({ file: fileOrError.value, body: input.body });
    }

    return right(prepared);
  }

  // se algum upload falhar, remove os que já subiram
  async upload(prepared: PreparedImage[]): Promise<void> {
    const results = await Promise.allSettled(
      prepared.map(({ file, body }) =>
        this.fileStorage.upload({
          storageKey: file.storageKey,
          body,
          mimeType: file.mimeType,
        }),
      ),
    );

    const failed = results.find((r) => r.status === 'rejected');
    if (failed) {
      await this.discard(prepared.map((p) => p.file.storageKey));
      throw failed.reason;
    }
  }

  async discard(storageKeys: string[]): Promise<void> {
    await Promise.allSettled(
      storageKeys.map((key) => this.fileStorage.delete(key)),
    );
  }
}
