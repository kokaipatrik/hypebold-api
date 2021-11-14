import { Module } from '@nestjs/common';
import { AdService } from './ad.service';
import { AdController } from './ad.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { Ad, AdSchema } from './schema/ad.schema';
import { CategoryModule } from './submodules/category/category.module';
import { BrandsModule } from './submodules/brands/brands.module';
import { ConditionsModule } from './submodules/conditions/conditions.module';
import { CurrencyModule } from './submodules/currency/currency.module';
import { SizesModule } from './submodules/sizes/sizes.module';
import { DeliveryModule } from './submodules/delivery/delivery.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ad.name, schema: AdSchema }]),
    CategoryModule,
    BrandsModule,
    ConditionsModule,
    CurrencyModule,
    SizesModule,
    DeliveryModule,
    UserModule,
  ],
  exports: [AdService],
  providers: [AdService],
  controllers: [AdController],
})
export class AdModule {}
