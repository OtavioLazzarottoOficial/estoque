import { UseCaseError } from '../../../../core/error/use-case-error';

export class QuantityCannotBeLessOrEqualThanZeroError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('The quantity cannot be less or equal than zero.');
  }
}
