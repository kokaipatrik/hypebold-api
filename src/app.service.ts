import { Injectable } from '@nestjs/common';

import { CategoryService } from './ad/submodules/category/category.service';
import { BrandsService } from './ad/submodules/brands/brands.service';
import { ConditionsService } from './ad/submodules/conditions/conditions.service';
import { CurrencyService } from './ad/submodules/currency/currency.service';
import { SizesService } from './ad/submodules/sizes/sizes.service';

@Injectable()
export class AppService {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly brandsService: BrandsService,
    private readonly conditionsService: ConditionsService,
    private readonly currencyService: CurrencyService,
    private readonly sizesService: SizesService,
  ) {}
  public getHello(): string {
    return 'Welcome.';
  }

  public async getConfig(): Promise<any> {
    const categories = await this.categoryService.findAll();
    const brands = await this.brandsService.findAll();
    const conditions = await this.conditionsService.findAll();
    const currencies = await this.currencyService.findAll();
    const sizes = await this.sizesService.findAll();

    return {
      categories: this.clearItems(categories),
      brands: this.clearItems(brands),
      conditions: this.clearItems(conditions),
      currencies: this.clearItems(currencies),
      sizes: this.clearItems(sizes),
    };
  }

  public clearItems(items: Array<any>): any {
    for (let item of items) {
      if (String(item._doc?.__v)) delete item._doc.__v;
      if (String(item._doc?._id)) delete item._doc._id;
      if (String(item._doc?.updatedAt)) delete item._doc.updatedAt;
      if (String(item._doc?.createdAt)) delete item._doc.createdAt;
    }

    return items;
  }
}
