import { UseCaseError } from '../../../../core/error/use-case-error';

export class QuantityMaxCannotBeLessThanQuantityMinError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('The quantity max cannot be less than quantity min.');
  }
}
