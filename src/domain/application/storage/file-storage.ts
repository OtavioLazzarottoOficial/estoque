export type UploadFileParams = {
  storageKey: string;
  body: Buffer;
  mimeType: string;
};

export abstract class FileStorage {
  abstract upload(params: UploadFileParams): Promise<void>;
  abstract delete(storageKey: string): Promise<void>;
  abstract getPublicUrl(storageKey: string): string;
}
