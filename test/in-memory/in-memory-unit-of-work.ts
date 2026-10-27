import { UnitOfWork } from '@/domain/application/repositories/unit-of-work';

export class InMemoryUnitOfWork implements UnitOfWork {
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return fn();
  }
}
