import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { ExistingUserDTO, NewUserDTO } from 'src/user/user.dto';
import { IUser } from 'src/user/user.interface';

import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async matchPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(email: string, password: string): Promise<IUser | null> {
    const user = await this.userService.findByEmail(email);
    const exists = !!user;

    if (!exists) {
      return null;
    }

    const match = await this.matchPassword(password, user.password);

    if (!match) {
      return null;
    }

    return this.userService._getIUser(user);
  }

  async register(user: Readonly<NewUserDTO>): Promise<IUser | any> {
    const { name, email, password } = user;

    const existingUser = await this.userService.findByEmail(email);

    if (existingUser) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['Email already in use'],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.userService.create(name, email, hashedPassword);

    return this.userService._getIUser(newUser);
  }

  async login(
    existingUser: ExistingUserDTO,
  ): Promise<{ user: IUser; token: string | null }> {
    const { email, password } = existingUser;
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['The email address or password is incorrect'],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const jwt = await this.jwtService.signAsync({ user });
    console.log({ jwt });
    return {
      user,
      token: jwt,
    };
  }
}
