import { Either, left, right } from '@/core/either';
import { ValueObject } from '@/core/entities/object-value';
import { InvalidImageMimeTypeError } from './errors/invalid-image-mime-type.error';
import { ImageTooLargeError } from './errors/image-too-large.error';

export type ImagePolicy = {
  allowedMimeTypes: readonly string[];
  maxSizeInBytes: number;
};

export type ImageFileProps = {
  storageKey: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
};

export class ImageFile extends ValueObject<ImageFileProps> {
  get storageKey() {
    return this.props.storageKey;
  }
  get url() {
    return this.props.url;
  }
  get originalName() {
    return this.props.originalName;
  }
  get mimeType() {
    return this.props.mimeType;
  }
  get size() {
    return this.props.size;
  }

  static restore(props: ImageFileProps): ImageFile {
    return new ImageFile(props);
  }

  static create(
    props: ImageFileProps,
    policy: ImagePolicy,
  ): Either<InvalidImageMimeTypeError | ImageTooLargeError, ImageFile> {
    if (!policy.allowedMimeTypes.includes(props.mimeType)) {
      return left(new InvalidImageMimeTypeError(props.mimeType));
    }

    if (props.size > policy.maxSizeInBytes) {
      return left(new ImageTooLargeError(policy.maxSizeInBytes));
    }

    return right(new ImageFile(props));
  }
}
