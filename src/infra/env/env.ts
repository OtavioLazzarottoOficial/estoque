import z from 'zod';

export const envSchema = z
  .object({
    DATABASE_URL: z.string().url(),
    PORT: z.coerce.number().optional().default(3000),
    JWT_PRIVATE_KEY: z.string(),
    JWT_PUBLIC_KEY: z.string(),
    CORS_ORIGINS: z.string().optional().default('*'),
    STORAGE_DRIVER: z.preprocess(
      (value) => (typeof value === 'string' ? value.toLowerCase() : value),
      z.enum(['local', 'r2']).optional().default('local'),
    ),
    STORAGE_LOCAL_PATH: z.string().optional().default('./uploads'),
    // Usado apenas no driver local para montar URLs absolutas (ex.: https://api.com)
    STORAGE_PUBLIC_URL: z.string().url().optional(),
    CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    AWS_BUCKET_NAME: z.string().optional(),
    AWS_ENDPOINT: z.string().url().optional(),
    AWS_REGION: z.string().optional().default('auto'),
    // URL pública do bucket R2 (r2.dev ou domínio customizado)
    CLOUDFLARE_R2_PUBLIC_URL: z.string().url().optional(),
  })
  .superRefine((env, ctx) => {
    if (env.STORAGE_DRIVER !== 'r2') {
      return;
    }

    const requiredFields: Array<keyof typeof env> = [
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'AWS_BUCKET_NAME',
      'CLOUDFLARE_R2_PUBLIC_URL',
    ];

    if (!env.CLOUDFLARE_ACCOUNT_ID && !env.AWS_ENDPOINT) {
      requiredFields.push('CLOUDFLARE_ACCOUNT_ID');
    }

    if (env.CLOUDFLARE_R2_PUBLIC_URL?.includes('.r2.cloudflarestorage.com')) {
      ctx.addIssue({
        code: 'custom',
        path: ['CLOUDFLARE_R2_PUBLIC_URL'],
        message:
          'CLOUDFLARE_R2_PUBLIC_URL deve ser a URL pública do bucket (r2.dev ou domínio customizado), não o endpoint da API S3',
      });
    }

    for (const field of requiredFields) {
      if (!env[field]) {
        ctx.addIssue({
          code: 'custom',
          path: [field],
          message: `${field} é obrigatório quando STORAGE_DRIVER=r2`,
        });
      }
    }
  });

export type Env = z.infer<typeof envSchema>;
