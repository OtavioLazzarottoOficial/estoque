import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@prisma/client/runtime/client';
import { ImageFile } from './value-objects/image-file';

export type ProductImageProps = {
  file: ImageFile;
  createdAt: Date;
};

export class ProductImage extends Entity<ProductImageProps> {
  get file() {
    return this.props.file;
  }
  get storageKey() {
    return this.props.file.storageKey;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(
    props: Optional<ProductImageProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    return new ProductImage(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    );
  }
}
