import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { CreateUserController } from './controllers/create-user.controller';
import { CreateUserUseCase } from '../../domain/application/usecases/create-user-usecase';
import { FetchRecentsUsersController } from './controllers/fetch-recents-users.controller';
import { FetchRecentsUsersUseCase } from '@/domain/application/usecases/fetch-recents-users.usecase';
import { AuthenticateController } from './controllers/authenticate.controller';
import { AuthenticateUseCase } from '@/domain/application/usecases/authenticate-usecase';
import { CreateCategoryController } from './controllers/create-category.controller';
import { CreateCategoryUseCase } from '@/domain/application/usecases/create-category-usecase';
import { CreateProductController } from './controllers/create-product.controller';
import { CreateProductUseCase } from '@/domain/application/usecases/create-product-usecase';
import { FetchRecentsProductsController } from './controllers/fetch-recents-products.controller';
import { FetchRecentsProductsUseCase } from '@/domain/application/usecases/fetch-recents-products.usecase';
import { CreateStockController } from './controllers/create-stock.controller';
import { GetByIdProductUseCase } from '@/domain/application/usecases/get-by-id-product-usecase';
import { GetByIdProductController } from './controllers/get-by-id-product.controller';
import { CreateStockUseCase } from '@/domain/application/usecases/create-stock-usecase';
import { IncreaseInStockController } from './controllers/increase-in-stock.controller';
import { IncreaseInStockUseCase } from '@/domain/application/usecases/increase-in-stock-usecase';
import { DecreaseInStockController } from './controllers/decrease-in-stock.controller';
import { DecreaseInStockUseCase } from '@/domain/application/usecases/decrease-in-stock-usecase';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateUserController,
    FetchRecentsUsersController,
    AuthenticateController,
    CreateCategoryController,
    CreateProductController,
    FetchRecentsProductsController,
    CreateStockController,
    GetByIdProductController,
    IncreaseInStockController,
    DecreaseInStockController,
  ],
  providers: [
    CreateUserUseCase,
    FetchRecentsUsersUseCase,
    AuthenticateUseCase,
    CreateCategoryUseCase,
    CreateProductUseCase,
    FetchRecentsProductsUseCase,
    CreateStockUseCase,
    GetByIdProductUseCase,
    IncreaseInStockUseCase,
    DecreaseInStockUseCase,
  ],
})
export class HttpModule {}
