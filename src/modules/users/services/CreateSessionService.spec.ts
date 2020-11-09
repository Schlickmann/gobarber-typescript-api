import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateSessionService from './CreateSessionService';
import CreateUserService from './CreateUserService';

describe('User Services', () => {
  describe('CreateSession', () => {
    it('should create session when information provided is valid', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeHashProvider = new FakeHashProvider();
      const createUser = new CreateUserService(
        fakeUsersRepository,
        fakeHashProvider,
      );
      const authenticatedUser = new CreateSessionService(
        fakeUsersRepository,
        fakeHashProvider,
      );

      const user = await createUser.execute({
        name: 'Juliani',
        email: 'juliani@gmail.com',
        password: '123456',
      });

      const session = await authenticatedUser.execute({
        email: 'juliani@gmail.com',
        password: '123456',
      });

      expect(session).toHaveProperty('token');
      expect(session.user).toEqual(user);
    });

    it('should not allow access when user is not valid', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeHashProvider = new FakeHashProvider();

      const authenticatedUser = new CreateSessionService(
        fakeUsersRepository,
        fakeHashProvider,
      );

      expect(
        authenticatedUser.execute({
          email: 'test@gmail.com',
          password: '123456',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('should not allow access when password is not valid', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeHashProvider = new FakeHashProvider();
      const createUser = new CreateUserService(
        fakeUsersRepository,
        fakeHashProvider,
      );
      const authenticatedUser = new CreateSessionService(
        fakeUsersRepository,
        fakeHashProvider,
      );

      await createUser.execute({
        name: 'Juliani',
        email: 'juliani@gmail.com',
        password: '123456',
      });

      expect(
        authenticatedUser.execute({
          email: 'juliani@gmail.com',
          password: 'ABCDEF',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });
  });
});
