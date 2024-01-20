import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Model, Types } from 'mongoose';

import { CreateBlock } from './schema/create-block.schema';
import { CreateBlockDto } from './dto/create-block.dto';

import { UserService } from 'src/user/user.service';

@Injectable()
export class BlockService {
  constructor(
    @InjectModel(CreateBlock.name)
    private readonly createBlockRepository: Model<CreateBlock>,
    private readonly userService: UserService,
  ) {}

  public async create(
    input: CreateBlockDto,
    userId: Types.ObjectId,
  ): Promise<any> {
    const block = await new this.createBlockRepository(input);
    block.userId = new Types.ObjectId(userId);

    return block.save();
  }

  public async addIdToUserCollection(
    userId: Types.ObjectId,
    blockId: Types.ObjectId,
  ): Promise<any> {
    await this.userService.findById(userId);
    const block = await this.userService.pushBlockIdToBlocks(userId, blockId);

    if (block) return block;
    throw new BadRequestException('Push operation failed.');
  }
}
