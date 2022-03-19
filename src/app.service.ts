import { Injectable } from '@nestjs/common';

import { BrandsService } from './ad/submodules/brands/brands.service';
import { CategoryService } from './ad/submodules/category/category.service';
import { ConditionsService } from './ad/submodules/conditions/conditions.service';
import { CurrencyService } from './ad/submodules/currency/currency.service';
import { DeliveryService } from './ad/submodules/delivery/delivery.service';
import { SizesService } from './ad/submodules/sizes/sizes.service';

@Injectable()
export class AppService {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly brandsService: BrandsService,
    private readonly conditionsService: ConditionsService,
    private readonly currencyService: CurrencyService,
    private readonly sizesService: SizesService,
    private readonly deliveryService: DeliveryService,
  ) {}
  public getHello(): string {
    return 'Welcome.';
  }

  public async getConfig(): Promise<any> {
    const brands = await this.brandsService.findAll();
    const categories = await this.categoryService.findAll();
    const conditions = await this.conditionsService.findAll();
    const currencies = await this.currencyService.findAll();
    const deliveries = await this.deliveryService.findAll();
    const sizes = await this.sizesService.findAll();

    return {
      brands: this.clearItems(brands),
      categories: this.clearItems(categories),
      conditions: this.clearItems(conditions),
      currencies: this.clearItems(currencies),
      deliveries: this.clearItems(deliveries),
      sizes: this.clearItems(sizes),
    };
  }

  public clearItems(items: Array<any>): any {
    for (let item of items) {
      if (String(item._doc?.__v)) delete item._doc.__v;
      if (String(item._doc?._id)) delete item._doc._id;
      if (String(item._doc?.categoryId)) delete item._doc.categoryId;
      if (String(item._doc?.updatedAt)) delete item._doc.updatedAt;
      if (String(item._doc?.createdAt)) delete item._doc.createdAt;
    }

    return items;
  }
}
