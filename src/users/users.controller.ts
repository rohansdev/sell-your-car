import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Session,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { AuthGuard } from '../guards/auth.guard';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@Controller('auth')
@Serialize(UserDto) //custom decorator to hide password from response
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  @HttpCode(HttpStatus.OK)
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Session() session: Record<string, string>,
  ) {
    const user = await this.authService.signup(createUserDto);
    session.name = user.name;
    session.userId = user.id.toString();
  }

  @Post('/signin')
  async signin(
    @Body() userData: { email: string; password: string },
    @Session() session: Record<string, string>,
  ) {
    if (session.name) {
      return {
        message: 'You have an active session.',
        name: session.name,
        userId: session.userId,
      };
    }

    const user = await this.authService.signin(
      userData.email,
      userData.password,
    );

    session.userId = user.id.toString();
    session.name = user.name;
    return user;
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signout')
  @HttpCode(HttpStatus.OK)
  signout(@Session() session: Record<string, any>) {
    session.userId = null;
    session.name = null;

    return { message: 'Logged out successfully.' };
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
