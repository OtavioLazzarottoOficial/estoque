import { UseCaseError } from '../../../../core/error/use-case-error';

export class QuantityCannotBeMoreThanQuantityMaxError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('The quantity cannot be more than quantity max');
  }
}
