import { makeUser } from '../../../../test/factories/make-user';
import { UsersInMemoryRepository } from '../../../../test/in-memory/users-in-memory-repository';
import { FetchRecentsUsersUseCase } from './fetch-recents-users.usecase';

let usersInMemoryRepository: UsersInMemoryRepository;
let sut: FetchRecentsUsersUseCase;

describe('FetchRecentsUsersUseCase', () => {
  beforeEach(() => {
    usersInMemoryRepository = new UsersInMemoryRepository();
    sut = new FetchRecentsUsersUseCase(usersInMemoryRepository);
  });

  it('Should be able to fetch recents users', async () => {
    usersInMemoryRepository.items.push(
      makeUser({ createdAt: new Date('2026-09-10T00:00:00Z') }),
    );

    usersInMemoryRepository.items.push(
      makeUser({ createdAt: new Date('2026-09-01T00:00:00Z') }),
    );

    usersInMemoryRepository.items.push(
      makeUser({ createdAt: new Date('2026-09-22T00:00:00Z') }),
    );

    const result = await sut.execute({ page: 1 });

    expect(result.isRight()).toBe(true);

    expect(result.value?.users).toHaveLength(3);

    expect(result.value?.users[0].createdAt).toEqual(
      new Date('2026-09-22T00:00:00Z'),
    );
    expect(result.value?.users[1].createdAt).toEqual(
      new Date('2026-09-10T00:00:00Z'),
    );
    expect(result.value?.users[2].createdAt).toEqual(
      new Date('2026-09-01T00:00:00Z'),
    );
  });
});
