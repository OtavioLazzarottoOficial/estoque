import { ImagePolicy } from './image-file';

const COMMON_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export const PRODUCT_IMAGE_POLICY: ImagePolicy = {
  allowedMimeTypes: COMMON_MIME_TYPES,
  maxSizeInBytes: 5 * 1024 * 1024, // 5MB
};

export const USER_AVATAR_POLICY: ImagePolicy = {
  allowedMimeTypes: COMMON_MIME_TYPES,
  maxSizeInBytes: 2 * 1024 * 1024, // 2MB
};
