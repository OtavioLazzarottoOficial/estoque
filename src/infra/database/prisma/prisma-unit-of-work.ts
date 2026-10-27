import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '@/domain/application/repositories/unit-of-work';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaUnitOfWork implements UnitOfWork {
  constructor(private prisma: PrismaService) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async () => {
      return fn();
    });
  }
}
