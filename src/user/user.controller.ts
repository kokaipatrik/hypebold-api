import {
  Controller,
  Headers,
  Post,
  Res,
  Body,
  HttpStatus,
} from '@nestjs/common';

import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserRole } from './interfaces/user.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  public async register(@Res() res: any, @Body() input: RegisterUserDto) {
    try {
      await this.userService.register(input, UserRole.USER);
      return res.status(HttpStatus.OK).json({
        message: 'User has been created.',
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  @Post('register/admin')
  public async registerAdmin(
    @Headers('adminSecret') adminSecret: string,
    @Res() res: any,
    @Body() input: RegisterUserDto,
  ) {
    try {
      await this.userService.validateAdminSecret(adminSecret);
      await this.userService.register(input, UserRole.ADMIN);
      return res.status(HttpStatus.OK).json({
        message: 'Admin user has been created.',
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }
}
