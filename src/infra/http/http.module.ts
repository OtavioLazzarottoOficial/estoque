import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { StorageModule } from '../storage/storage.module';
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
import { FetchRecentsCategoriesController } from './controllers/fetch-recents-categories.controller';
import { FetchRecentsCategoriesUseCase } from '@/domain/application/usecases/fetch-recents-categories.usecase';
import { DeleteProductController } from './controllers/delete-product.controller';
import { DeleteProductUseCase } from '@/domain/application/usecases/delete-product-usecase';
import { GetStockByProductUseCase } from '@/domain/application/usecases/get-stock-by-product';
import { GetStockByProductController } from './controllers/get-stock-by-product.controller';
import { UploadProductImagesController } from './controllers/upload-product-images.controller';
import { UploadProductImagesUseCase } from '@/domain/application/usecases/upload-product-images-usecase';
import { DeleteProductImageController } from './controllers/delete-product-image.controller';
import { DeleteProductImageUseCase } from '@/domain/application/usecases/delete-product-image-usecase';
import { SetMainProductImageController } from './controllers/set-main-product-image.controller';
import { SetMainProductImageUseCase } from '@/domain/application/usecases/set-main-product-image-usecase';
import { UploadUserAvatarController } from './controllers/upload-user-avatar.controller';
import { UploadUserAvatarUseCase } from '@/domain/application/usecases/upload-user-avatar-usecase';
import { DeleteUserAvatarController } from './controllers/delete-user-avatar.controller';
import { DeleteUserAvatarUseCase } from '@/domain/application/usecases/delete-user-avatar-usecase';

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateUserController,
    FetchRecentsUsersController,
    AuthenticateController,
    CreateCategoryController,
    CreateProductController,
    UploadProductImagesController,
    DeleteProductImageController,
    SetMainProductImageController,
    UploadUserAvatarController,
    DeleteUserAvatarController,
    FetchRecentsProductsController,
    FetchRecentsCategoriesController,
    CreateStockController,
    GetByIdProductController,
    IncreaseInStockController,
    DecreaseInStockController,
    DeleteProductController,
    GetStockByProductController,
  ],
  providers: [
    CreateUserUseCase,
    FetchRecentsUsersUseCase,
    AuthenticateUseCase,
    CreateCategoryUseCase,
    CreateProductUseCase,
    UploadProductImagesUseCase,
    DeleteProductImageUseCase,
    SetMainProductImageUseCase,
    UploadUserAvatarUseCase,
    DeleteUserAvatarUseCase,
    FetchRecentsProductsUseCase,
    FetchRecentsCategoriesUseCase,
    CreateStockUseCase,
    GetByIdProductUseCase,
    IncreaseInStockUseCase,
    DecreaseInStockUseCase,
    DeleteProductUseCase,
    GetStockByProductUseCase,
  ],
})
export class HttpModule {}
