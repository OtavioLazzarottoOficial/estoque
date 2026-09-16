import { UseCaseError } from '../../../../core/error/use-case-error';

export class QuantityCannotBeLessThanZeroError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('The quantity cannot be less than zero.');
  }
}
