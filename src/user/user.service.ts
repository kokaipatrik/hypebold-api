import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './schema/user.schema';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { UserRole } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userRepository: Model<User>,
  ) {}

  public async register(input: RegisterUserDto, role: UserRole): Promise<User> {
    const user = await new this.userRepository({
      ...input,
      password: bcrypt.hashSync(input.password, 8),
      role: role,
    });
    await this.isEmailRoleExist(user.email, role);
    return user.save();
  }

  public async postUserProfile(userId: Types.ObjectId, input: UserProfileDto): Promise<User> {
    await this.findById(userId);
    const user = await this.userRepository.findOneAndUpdate(
      { _id: userId },
      {

        $push: {
          profile: {
            ...input,
          }
        },
      },
    );
    if (user) return user;
    throw new BadRequestException('Push operation failed.');
  }

  private async isEmailRoleExist(email: string, role: UserRole): Promise<void> {
    const user = await this.userRepository.findOne({
      email: email,
      role: role,
    });
    if (user) throw new BadRequestException('This e-mail already in use!');
  }

  public async findUserByEmailRole(
    email: string,
    role: UserRole,
  ): Promise<UserDocument> {
    const user = await this.userRepository.findOne({
      email: email,
      role: role,
    });
    if (!user) throw new NotFoundException('Wrong e-mail or password.');
    return user;
  }

  public async checkPassword(
    currentPassword: string,
    userPassword: string,
  ): Promise<boolean> {
    const match = await bcrypt.compare(currentPassword, userPassword);
    if (!match) throw new NotFoundException('Wrong e-mail or password.');
    return match;
  }

  public async findByPayload(email: string): Promise<UserDocument> {
    return await this.userRepository.findOne({ email: email });
  }

  public async validateAdminSecret(secret: string): Promise<boolean> {
    if (process.env.HYPEBOLD_ADMIN_SECRET != secret)
      throw new UnauthorizedException('Admin secret is required.');
    return true;
  }

  public async findById(id: Types.ObjectId): Promise<User> {
    const user = this.userRepository.findById(id);
    if (user) return user;
    throw new BadRequestException('User is not exist!');
  }

  public async pushAdIdToAds(
    userId: Types.ObjectId,
    adId: Types.ObjectId,
  ): Promise<User> {
    const user = await this.userRepository.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          ads: adId,
        },
      },
    );

    if (user) return user;
    throw new BadRequestException('Push operation failed.');
  }
}
