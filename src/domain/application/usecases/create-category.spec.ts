import { CategoriesInMemoryRepository } from '../../../../test/in-memory/categories-in-memory-repository';
import { CreateCategoryUseCase } from './create-category-usecase';

let categoriesInMemoryRepository: CategoriesInMemoryRepository;
let sut: CreateCategoryUseCase;
describe('Create Category Use Case', () => {
  beforeEach(() => {
    categoriesInMemoryRepository = new CategoriesInMemoryRepository();
    sut = new CreateCategoryUseCase(categoriesInMemoryRepository);
  });

  it('Should be able create a Category', async () => {
    const result = await sut.execute({
      name: 'Informartica',
      description: 'testando categoria',
    });

    expect(result.isRight()).toBe(true);
    expect(categoriesInMemoryRepository.items).toHaveLength(1);
  });
});
