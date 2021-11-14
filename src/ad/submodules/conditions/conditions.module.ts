import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Condition, ConditionSchema } from './schema/condition.schema';
import { ConditionsService } from './conditions.service';
import { ConditionsController } from './conditions.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Condition.name, schema: ConditionSchema },
    ]),
  ],
  exports: [ConditionsService],
  providers: [ConditionsService],
  controllers: [ConditionsController],
})
export class ConditionsModule {}
