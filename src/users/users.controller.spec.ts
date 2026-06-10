import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: {
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };
  let authService: {
    signup: jest.Mock;
    signin: jest.Mock;
  };

  beforeEach(async () => {
    usersService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    authService = {
      signup: jest.fn(),
      signin: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersService },
        { provide: AuthService, useValue: authService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('signs up a user and stores session data', async () => {
    const createUserDto = { email: 'user@example.com', password: 'secret' };
    const user = { id: 1, name: 'Test User' } as User;

    authService.signup.mockResolvedValue(user);

    const session = {} as Record<string, string>;

    await controller.create(createUserDto as any, session);

    expect(authService.signup).toHaveBeenCalledWith(createUserDto);
    expect(session).toEqual({ name: 'Test User', userId: '1' });
  });

  it('returns the current session when the user is already signed in', async () => {
    const session = { name: 'Test User', userId: '1' } as Record<
      string,
      string
    >;

    const result = await controller.signin(
      { email: 'user@example.com', password: 'secret' },
      session,
    );

    expect(result).toEqual({
      message: 'You have an active session.',
      name: 'Test User',
      userId: '1',
    });
    expect(authService.signin).not.toHaveBeenCalled();
  });

  it('signs in a user and returns the authenticated user', async () => {
    const user = { id: 2, name: 'Logged In User' } as User;
    authService.signin.mockResolvedValue(user);

    const session = {} as Record<string, string>;

    const result = await controller.signin(
      { email: 'user@example.com', password: 'secret' },
      session,
    );

    expect(authService.signin).toHaveBeenCalledWith(
      'user@example.com',
      'secret',
    );
    expect(session).toEqual({ name: 'Logged In User', userId: '2' });
    expect(result).toBe(user);
  });

  it('returns the current user profile', () => {
    const user = { id: 3, name: 'Profile User' } as User;

    expect(controller.getProfile(user)).toBe(user);
  });

  it('clears the session on logout', () => {
    const session = { name: 'Test User', userId: '1' } as Record<string, any>;

    const result = controller.logout(session);

    expect(session).toEqual({ name: null, userId: null });
    expect(result).toEqual({ message: 'Logged out successfully.' });
  });

  it('delegates findAll to the users service', async () => {
    const users = [{ id: 1, email: 'a@example.com' }];
    usersService.findAll.mockResolvedValue(users);

    await expect(controller.findAll()).resolves.toBe(users);
    expect(usersService.findAll).toHaveBeenCalled();
  });

  it('delegates findOne to the users service', async () => {
    const user = { id: 7, email: 'find@example.com' };
    usersService.findOne.mockResolvedValue(user);

    await expect(controller.findOne('7')).resolves.toBe(user);
    expect(usersService.findOne).toHaveBeenCalledWith(7);
  });

  it('delegates update to the users service', async () => {
    const updatedUser = { id: 8, email: 'updated@example.com' };
    usersService.update.mockResolvedValue(updatedUser);

    await expect(
      controller.update('8', { name: 'Updated' } as any),
    ).resolves.toBe(updatedUser);
    expect(usersService.update).toHaveBeenCalledWith(8, { name: 'Updated' });
  });

  it('delegates remove to the users service', async () => {
    usersService.remove.mockResolvedValue(undefined);

    await expect(controller.remove('9')).resolves.toBeUndefined();
    expect(usersService.remove).toHaveBeenCalledWith(9);
  });
});
