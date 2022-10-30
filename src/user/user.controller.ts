import {
  Controller,
  Headers,
  Post,
  Res,
  Body,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';

import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserRole } from './interfaces/user.interface';
import { UserProfileDto } from './dto/user-profile.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

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

  @Post('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  public async userProfile(
    @Req() req: any,
    @Res() res: any,
    @Body() input: UserProfileDto,
  ) {
    try {
      await this.userService.postUserProfile(req.user.id, input);
      return res.status(HttpStatus.OK).json({
        message: 'Profile update was success.',
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }
}
