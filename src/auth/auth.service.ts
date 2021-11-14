import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { UserDocument } from '../user/schema/user.schema';
import { ValidatedUser } from 'src/user/interfaces/user.interface';
import { UserRole } from 'src/user/interfaces/user.interface';

interface JwtToken {
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(
    input: LoginUserDto,
    role: UserRole,
  ): Promise<JwtToken> {
    const user = await this.userService.findUserByEmailRole(input.email, role);
    const passwordCheck = await this.userService.checkPassword(
      input.password,
      user.password,
    );

    if (passwordCheck) return this.generateJwtToken(user);
    throw new UnauthorizedException();
  }

  public generateJwtToken(user: UserDocument): JwtToken {
    const payload: ValidatedUser = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
