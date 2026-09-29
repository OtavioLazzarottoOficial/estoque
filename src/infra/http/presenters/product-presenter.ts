import { Product } from '@/domain/enterprise/entities/product';

export class ProductPresenter {
  static toHttp(product: Product) {
    return {
      id: product.id.toString(),
      sku: product.sku,
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      price: product.price,
      status: product.status,
      category: product.category
        ? {
            id: product.category.id.toString(),
            name: product.category.name,
          }
        : null,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
    };
  }
}
