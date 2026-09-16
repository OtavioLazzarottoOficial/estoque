import { UseCaseError } from '../../../../core/error/use-case-error';

export class QuantityMinCannotBeMoreThanQuantityMaxError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('The quantity min cannot be more than quantity max.');
  }
}
