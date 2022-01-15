import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ValidatedUser } from 'src/user/interfaces/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.HYPER_JWT_SECRET,
    });
  }

  public async validate(payload: any): Promise<ValidatedUser> {
    return { id: payload.id, username: payload.username, email: payload.email, role: payload.role };
  }
}
