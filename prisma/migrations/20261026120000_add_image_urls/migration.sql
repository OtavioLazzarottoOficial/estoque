-- AlterTable
ALTER TABLE "User" ADD COLUMN "avatar_url" TEXT;

-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN "url" TEXT;

-- Backfill: registros antigos passam a ter a chave como URL até o próximo upload
UPDATE "User" SET "avatar_url" = "avatar_storage_key" WHERE "avatar_storage_key" IS NOT NULL;
UPDATE "ProductImage" SET "url" = "storage_key";

-- A URL é obrigatória para imagens de produto
ALTER TABLE "ProductImage" ALTER COLUMN "url" SET NOT NULL;
