import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeProduct } from '../../../../test/factories/make-product';
import { ProductInMemoryRepository } from '../../../../test/in-memory/product-in-memory-repository';
import { DeleteProductUseCase } from './delete-product-usecase';
let productsInMemoryRepository: ProductInMemoryRepository;
let sut: DeleteProductUseCase;

describe('DeleteProductUseCase', () => {
  beforeEach(() => {
    productsInMemoryRepository = new ProductInMemoryRepository();
    sut = new DeleteProductUseCase(productsInMemoryRepository);
  });

  it('Should be able to delete a product', async () => {
    const product = makeProduct({}, new UniqueEntityID('1'));

    if (product.isLeft()) {
      return null;
    }

    productsInMemoryRepository.items.push(product.value);

    const result = await sut.execute({ id: '1' });

    expect(result.isRight()).toBe(true);
    expect(productsInMemoryRepository.items).toHaveLength(0);
  });
});
