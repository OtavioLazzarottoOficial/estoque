import {
  FileStorage,
  UploadFileParams,
} from '@/domain/application/storage/file-storage';
import { EnvService } from '../env/env.service';
import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

@Injectable()
export class LocalFileStorage implements FileStorage {
  private basePath: string;
  private publicBaseUrl: string | null;

  constructor(envService: EnvService) {
    this.basePath = path.resolve(envService.get('STORAGE_LOCAL_PATH'));
    this.publicBaseUrl =
      envService.get('STORAGE_PUBLIC_URL')?.replace(/\/+$/, '') ?? null;
  }

  private getFilePath(storageKey: string): string {
    const safeKey = path.normalize(storageKey).replace(/^(\.\.(\/|\\|$))+/, '');
    return path.join(this.basePath, safeKey);
  }

  getPublicUrl(storageKey: string): string {
    const encodedKey = storageKey
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/');

    return this.publicBaseUrl
      ? `${this.publicBaseUrl}/${encodedKey}`
      : `/uploads/${encodedKey}`;
  }

  async upload(params: UploadFileParams): Promise<void> {
    const fullPath = this.getFilePath(params.storageKey);
    const directory = path.dirname(fullPath);

    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(fullPath, params.body);
  }

  async delete(storageKey: string): Promise<void> {
    const fullPath = this.getFilePath(storageKey);

    try {
      await fs.unlink(fullPath);
    } catch {
      // Arquivo inexistente ou já removido
    }
  }
}
