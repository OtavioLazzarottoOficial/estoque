import { randomInt } from 'node:crypto';
import { ValueObject } from '../../../../core/entities/object-value';

type Props = {
  name: string;
  categoryName: string;
};

type SkuProps = {
  sku: string;
};

export class SkuObjectValue extends ValueObject<SkuProps> {
  private constructor(props: SkuProps) {
    super(props);
  }

  get value(): string {
    return this.props.sku;
  }

  static create({ name, categoryName }: Props): SkuObjectValue {
    const sku = `${name.toUpperCase().substring(0, 3)}-${categoryName.toUpperCase().substring(0, 3)}-${randomInt(1000)}`;

    return new SkuObjectValue({ sku });
  }
}
