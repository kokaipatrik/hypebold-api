import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AdModule } from './ad/ad.module';
import { BrandsModule } from './ad/submodules/brands/brands.module';
import { CategoryModule } from './ad/submodules/category/category.module';
import { ConditionsModule } from './ad/submodules/conditions/conditions.module';
import { CurrencyModule } from './ad/submodules/currency/currency.module';
import { DeliveryModule } from './ad/submodules/delivery/delivery.module';
import { SizesModule } from './ad/submodules/sizes/sizes.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.HYPEBOLD_MONGO),
    UserModule,
    AuthModule,
    AdModule,
    BrandsModule,
    CategoryModule,
    ConditionsModule,
    CurrencyModule,
    DeliveryModule,
    SizesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
