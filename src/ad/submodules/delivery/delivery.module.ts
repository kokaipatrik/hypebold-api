import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Delivery, DeliverySchema } from './schema/delivery.schema';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Delivery.name, schema: DeliverySchema },
    ]),
  ],
  exports: [DeliveryService],
  providers: [DeliveryService],
  controllers: [DeliveryController],
})
export class DeliveryModule {}
