import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { EnvModule } from '../env/env.module';
import { UsersRepository } from '../../domain/application/repositories/users-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { CategoriesRepository } from '@/domain/application/repositories/categories-repository';
import { PrismaCategoriesRepository } from './prisma/repositories/prisma-categories-repository';
import { ProductsRepository } from '@/domain/application/repositories/products-repository';
import { PrismaProductsRepository } from './prisma/repositories/prisma-products-repository';
import { StocksRepository } from '@/domain/application/repositories/stocks-repository';
import { PrismaStocksRepository } from './prisma/repositories/prisma-stocks-repository';
import { MovementsStockRepository } from '@/domain/application/repositories/movements-stock-repository';
import { PrismaMovementsStockRepository } from './prisma/repositories/prisma-movements-stock-repository';

@Module({
  imports: [EnvModule],
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: CategoriesRepository,
      useClass: PrismaCategoriesRepository,
    },
    {
      provide: ProductsRepository,
      useClass: PrismaProductsRepository,
    },
    {
      provide: StocksRepository,
      useClass: PrismaStocksRepository,
    },
    {
      provide: MovementsStockRepository,
      useClass: PrismaMovementsStockRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    CategoriesRepository,
    ProductsRepository,
    StocksRepository,
    MovementsStockRepository,
  ],
})
export class DatabaseModule {}
