import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProviders/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('User Services', () => {
  describe('UpdateUserAvatar', () => {
    it('should add new avatar', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeStorageProvider = new FakeStorageProvider();
      const updateUserAvatar = new UpdateUserAvatarService(
        fakeUsersRepository,
        fakeStorageProvider,
      );

      const user = await fakeUsersRepository.create({
        name: 'Juliani',
        email: 'juliani@gmail.com',
        password: '123456',
      });

      await updateUserAvatar.execute({
        user_id: user.id,
        avatarFilename: 'avatar.png',
      });

      expect(user.avatar).toBe('avatar.png');
    });

    it('should delete previous avatar when adding new one', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeStorageProvider = new FakeStorageProvider();

      const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

      const updateUserAvatar = new UpdateUserAvatarService(
        fakeUsersRepository,
        fakeStorageProvider,
      );

      const user = await fakeUsersRepository.create({
        name: 'Juliani',
        email: 'juliani@gmail.com',
        password: '123456',
      });

      await updateUserAvatar.execute({
        user_id: user.id,
        avatarFilename: 'avatar.png',
      });

      await updateUserAvatar.execute({
        user_id: user.id,
        avatarFilename: 'avatar1.png',
      });

      expect(deleteFile).toHaveBeenCalledWith('avatar.png');
      expect(user.avatar).toBe('avatar1.png');
    });

    it('should not add avatar to non-existing users', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeStorageProvider = new FakeStorageProvider();
      const updateUserAvatar = new UpdateUserAvatarService(
        fakeUsersRepository,
        fakeStorageProvider,
      );

      expect(
        updateUserAvatar.execute({
          user_id: 'non-existing-user',
          avatarFilename: 'avatar.png',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });
  });
});
