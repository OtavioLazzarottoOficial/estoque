import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import {
  FileStorage,
  UploadFileParams,
} from '@/domain/application/storage/file-storage';
import { EnvService } from '../env/env.service';

@Injectable()
export class R2FileStorage implements FileStorage {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicBaseUrl: string;

  constructor(envService: EnvService) {
    const accountId = envService.get('CLOUDFLARE_ACCOUNT_ID');
    const endpoint =
      envService.get('AWS_ENDPOINT') ??
      (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);

    if (!endpoint) {
      throw new Error(
        'CLOUDFLARE_ACCOUNT_ID ou AWS_ENDPOINT deve ser informado quando STORAGE_DRIVER=r2',
      );
    }

    this.bucket = envService.get('AWS_BUCKET_NAME')!;
    this.publicBaseUrl = envService
      .get('CLOUDFLARE_R2_PUBLIC_URL')
      .replace(/\/+$/, '');

    this.client = new S3Client({
      region: envService.get('AWS_REGION'),
      endpoint,
      credentials: {
        accessKeyId: envService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: envService.get('AWS_SECRET_ACCESS_KEY'),
      },
      // Evita o envio/validação de checksums flexíveis por padrão,
      // que não são totalmente suportados pelo R2 em todas as operações.
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    });
  }

  async upload({
    storageKey,
    body,
    mimeType,
  }: UploadFileParams): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
        Body: body,
        ContentType: mimeType,
        // URLs imutáveis: cada upload recebe uma chave nova com UUID
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );
  }

  async delete(storageKey: string): Promise<void> {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: storageKey,
        }),
      );
    } catch {
      // Objeto inexistente ou já removido: a operação é idempotente
    }
  }

  getPublicUrl(storageKey: string): string {
    const encodedKey = storageKey
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/');

    return `${this.publicBaseUrl}/${encodedKey}`;
  }
}
