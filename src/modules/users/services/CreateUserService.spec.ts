import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

describe('User Services', () => {
  describe('CreateUser', () => {
    it('should create a new user', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeHashProvider = new FakeHashProvider();
      const createUser = new CreateUserService(
        fakeUsersRepository,
        fakeHashProvider,
      );

      const user = await createUser.execute({
        name: 'Juliani',
        email: 'juliani@gmail.com',
        password: '123456',
      });

      expect(user).toHaveProperty('id');
      expect(user.email).toBe('juliani@gmail.com');
    });

    it('should not create two users with same email address', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeHashProvider = new FakeHashProvider();
      const createUser = new CreateUserService(
        fakeUsersRepository,
        fakeHashProvider,
      );

      await createUser.execute({
        name: 'Juliani Schlickmann',
        email: 'juliani@gmail.com',
        password: 'hahaha',
      });

      expect(
        createUser.execute({
          name: 'Juliani',
          email: 'juliani@gmail.com',
          password: '123456',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });
  });
});
