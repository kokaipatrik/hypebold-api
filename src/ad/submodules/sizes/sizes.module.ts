import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Size, SizeSchema } from './schema/size.schema';
import { SizesService } from './sizes.service';
import { SizesController } from './sizes.controller';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Size.name, schema: SizeSchema }]),
    CategoryModule,
  ],
  exports: [SizesService],
  providers: [SizesService],
  controllers: [SizesController],
})
export class SizesModule {}
