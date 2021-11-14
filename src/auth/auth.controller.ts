import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Res,
  Request,
  HttpStatus,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from 'src/user/interfaces/user.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  public async login(@Res() res: any, @Body() input: LoginUserDto) {
    try {
      const user = await this.authService.validateUser(input, UserRole.USER);
      return res.status(HttpStatus.OK).json({
        ...user,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  @Post('login/admin')
  public async loginAdmin(@Res() res: any, @Body() input: LoginUserDto) {
    try {
      const user = await this.authService.validateUser(input, UserRole.ADMIN);
      return res.status(HttpStatus.OK).json({
        ...user,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Get('me')
  public getMe(@Request() req: any) {
    return req.user;
  }
}
