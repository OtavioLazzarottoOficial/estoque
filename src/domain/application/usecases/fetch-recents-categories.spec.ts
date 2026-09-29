import { makeCategory } from '../../../../test/factories/make-category';
import { CategoriesInMemoryRepository } from '../../../../test/in-memory/categories-in-memory-repository';
import { FetchRecentsCategoriesUseCase } from './fetch-recents-categories.usecase';

let categoriesInMemoryRepository: CategoriesInMemoryRepository;
let sut: FetchRecentsCategoriesUseCase;

describe('FetchRecentsCategoriesUseCase', () => {
  beforeEach(() => {
    categoriesInMemoryRepository = new CategoriesInMemoryRepository();
    sut = new FetchRecentsCategoriesUseCase(categoriesInMemoryRepository);
  });

  it('Should be able to fetch recents categories', async () => {
    categoriesInMemoryRepository.items.push(
      makeCategory({ createdAt: new Date('2026-09-10T00:00:00Z') }),
    );

    categoriesInMemoryRepository.items.push(
      makeCategory({ createdAt: new Date('2026-09-01T00:00:00Z') }),
    );

    const result = await sut.execute({ page: 1 });

    expect(result.isRight()).toBe(true);

    expect(result.value?.categories).toHaveLength(2);

    expect(result.value?.categories[0].createdAt).toEqual(
      new Date('2026-09-10T00:00:00Z'),
    );
    expect(result.value?.categories[1].createdAt).toEqual(
      new Date('2026-09-01T00:00:00Z'),
    );
  });
});
