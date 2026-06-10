import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

describe('AuthService', () => {
  let service: AuthService;
  let usersService: {
    find: jest.Mock;
    create: jest.Mock;
  };

  beforeEach(async () => {
    usersService = {
      find: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('creates a new user with a hashed password', async () => {
    usersService.find.mockResolvedValue([]);
    usersService.create.mockImplementation((userData) => ({
      id: 1,
      ...userData,
    }));

    const user = await service.signup({
      name: 'Rohan',
      email: 'r@s.com',
      password: '1@R31231#s23',
    });

    expect(usersService.find).toHaveBeenCalledWith('r@s.com');
    expect(usersService.create).toHaveBeenCalledTimes(1);
    expect(user.password).not.toEqual('1@R31231#s23');
    expect(user.password).toContain('.');
    expect(user.password.split('.')).toHaveLength(2);
  });

  it('rejects signup when the email is already registered', async () => {
    usersService.find.mockResolvedValue([{ email: 'r@s.com' }]);

    await expect(
      service.signup({
        name: 'Rohan',
        email: 'r@s.com',
        password: '1@R31231#s23',
      }),
    ).rejects.toThrow(BadRequestException);

    expect(usersService.create).not.toHaveBeenCalled();
  });

  it('signs in a user when the password matches', async () => {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt('1@R31231#s23', salt, 32)) as Buffer;
    const storedPassword = `${salt}.${hash.toString('hex')}`;

    const existingUser = {
      id: 1,
      name: 'Rohan',
      email: 'r@s.com',
      password: storedPassword,
    };

    usersService.find.mockResolvedValue([existingUser]);

    await expect(service.signin('r@s.com', '1@R31231#s23')).resolves.toEqual(
      existingUser,
    );
    expect(usersService.find).toHaveBeenCalledWith('r@s.com');
  });

  it('rejects signin when the user does not exist', async () => {
    usersService.find.mockResolvedValue([]);

    await expect(
      service.signin('missing@s.com', 'any-password'),
    ).rejects.toThrow(NotFoundException);
  });

  it('rejects signin when the password is incorrect', async () => {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt('correct-password', salt, 32)) as Buffer;

    usersService.find.mockResolvedValue([
      {
        id: 1,
        name: 'Rohan',
        email: 'r@s.com',
        password: `${salt}.${hash.toString('hex')}`,
      },
    ]);

    await expect(service.signin('r@s.com', 'wrong-password')).rejects.toThrow(
      BadRequestException,
    );
  });
});
