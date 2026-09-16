import { UseCaseError } from '../../../../core/error/use-case-error';

export class PriceCannotBeLessThanZeroError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('The Price cannot be less than zero.');
  }
}
