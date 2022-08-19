import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ExistingUserDTO, NewUserDTO } from 'src/user/user.dto';
import { IUser } from 'src/user/user.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() user: NewUserDTO): Promise<IUser | null> {
    return this.authService.register(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(
    @Body() user: ExistingUserDTO,
  ): Promise<{ user: IUser; token: string } | null> {
    return this.authService.login(user);
  }
}
