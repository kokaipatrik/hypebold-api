import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BlockService } from './block.service';
import { BlockController } from './block.controller';

import { CreateBlock, CreateBlockSchema } from './schema/create-block.schema';

import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CreateBlock.name, schema: CreateBlockSchema }]),
    UserModule,
  ],
  exports: [BlockService],
  providers: [BlockService],
  controllers: [BlockController],
})
export class BlockModule {}
