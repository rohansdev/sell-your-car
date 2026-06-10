import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from './dto/create-user.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(userData: CreateUserDto) {
    const userExists = await this.usersService.find(userData.email);

    if (userExists.length) {
      throw new BadRequestException('Email is already in use.');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(userData.password, salt, 32)) as Buffer;
    userData.password = salt + '.' + hash.toString('hex');

    const newUser = await this.usersService.create(userData);

    return newUser;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const [salt, storedHash] = user.password.split('.');

    const passwordHash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== passwordHash.toString('hex')) {
      throw new BadRequestException('Incorrect login info.');
    }

    return user;
  }
}
