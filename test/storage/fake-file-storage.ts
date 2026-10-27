import {
  FileStorage,
  UploadFileParams,
} from '@/domain/application/storage/file-storage';

export class FakeFileStorage implements FileStorage {
  public uploads: Map<string, { body: Buffer; mimeType: string }> = new Map();

  async upload(params: UploadFileParams): Promise<void> {
    this.uploads.set(params.storageKey, {
      body: params.body,
      mimeType: params.mimeType,
    });
    await Promise.resolve();
  }

  async delete(storageKey: string): Promise<void> {
    this.uploads.delete(storageKey);
    await Promise.resolve();
  }

  getPublicUrl(storageKey: string): string {
    return `https://storage.test/${storageKey}`;
  }
}
