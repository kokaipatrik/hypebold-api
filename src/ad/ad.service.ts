import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Ad } from './schema/ad.schema';
import { CreateAdDto } from './dto/create-ad.dto';
import { CategoryService } from './submodules/category/category.service';
import { BrandsService } from './submodules/brands/brands.service';
import { ConditionsService } from './submodules/conditions/conditions.service';
import { CurrencyService } from './submodules/currency/currency.service';
import { SizesService } from './submodules/sizes/sizes.service';
import { DeliveryService } from './submodules/delivery/delivery.service';
import { UserService } from 'src/user/user.service';
import { shoes } from './submodules/sizes/types/size.types';

export class AdWithId {
  _id: Types.ObjectId;
}

export interface TransformedData {
  name: string;
  id: Types.ObjectId;
}

export interface TransformedSizeData {
  size: shoes | string;
  id: Types.ObjectId;
}

export interface TransformedCurrencyData {
  name: string;
  currency: string;
  id: Types.ObjectId;
}

export interface TransformedAd {
  name: string;
  price: number;
  description: string;
  town: string;
  telephone: string;
  images: Array<string>;
  category: TransformedData;
  brand: TransformedData;
  condition: TransformedData;
  currency: TransformedCurrencyData;
  size: TransformedSizeData;
  delivery: TransformedData;
  userId: Types.ObjectId;
}

@Injectable()
export class AdService {
  constructor(
    @InjectModel(Ad.name)
    private readonly adRepository: Model<Ad>,
    private readonly categoryService: CategoryService,
    private readonly brandsService: BrandsService,
    private readonly conditionsService: ConditionsService,
    private readonly currencyService: CurrencyService,
    private readonly sizesService: SizesService,
    private readonly deliveryService: DeliveryService,
    private readonly userService: UserService,
  ) {}

  public async create(
    input: CreateAdDto,
    userId: Types.ObjectId,
  ): Promise<any> {
    const ad = await new this.adRepository(input);
    ad.userId = new Types.ObjectId(userId);
    ad.categoryId = new Types.ObjectId(ad.categoryId);
    ad.brandId = new Types.ObjectId(ad.brandId);
    ad.conditionId = new Types.ObjectId(ad.conditionId);
    ad.currencyId = new Types.ObjectId(ad.currencyId);
    ad.sizeId = new Types.ObjectId(ad.sizeId);
    ad.deliveryId = new Types.ObjectId(ad.deliveryId);

    await this.categoryService.findById(ad.categoryId);
    await this.brandsService.findById(ad.brandId);
    await this.conditionsService.findById(ad.conditionId);
    await this.currencyService.findById(ad.currencyId);
    await this.sizesService.findById(ad.sizeId);
    await this.deliveryService.findById(ad.deliveryId);

    return ad.save();
  }

  public async addAdIdToUserCollection(
    userId: Types.ObjectId,
    adId: Types.ObjectId,
  ): Promise<any> {
    await this.userService.findById(userId);
    const ad = await this.userService.pushAdIdToAds(userId, adId);

    if (ad) return ad;
    throw new BadRequestException('Push operation failed.');
  }

  public async getAdsByQueries(
    categoryParam: string,
    brandParam: string,
    conditionParam: string,
    sizeParam: string,
    page: number,
    limit: number
  ): Promise<any> {
    const category = categoryParam
      ? await this.categoryService.findByUrl(categoryParam)
      : null;
    const brand = brandParam
      ? await this.brandsService.findByUrl(brandParam)
      : null;
    const condition = conditionParam
      ? await this.conditionsService.findByUrl(conditionParam)
      : null;
    const size = sizeParam
      ? await this.sizesService.findByUrlAndCategoryId(sizeParam, category._id)
      : null;

    const match = { $match: {} };
    const sort = { $sort: { "_id": 1 } };
    const skipAggregate = (page && limit) ? { $skip: Number((page - 1) * limit) } : null;
    const limitAggregate = (page && limit) ? { $limit: Number(limit) } : null;
    const aggregate: Array<any> = [match, sort];

    if (category !== null) match.$match['categoryId'] = category._id;
    if (brand !== null) match.$match['brandId'] = brand._id;
    if (condition !== null) match.$match['conditionId'] = condition._id;
    if (size !== null) match.$match['sizeId'] = size[0]._id;

    if (skipAggregate !== null && limitAggregate) aggregate.push(skipAggregate, limitAggregate);

    const ads = await this.adRepository.aggregate(aggregate);
    const transformedAds = [];

    if (ads.length) {
      for (const ad of ads) {
        transformedAds.push(await this.transformAdData(ad));
      }
      return transformedAds;
    } else throw new BadRequestException('Ads are not exist!');
  }

  public async transformAdData(ad: Ad & AdWithId): Promise<TransformedAd> {
    const category = await this.categoryService.findById(ad.categoryId);
    const brand = await this.brandsService.findById(ad.brandId);
    const condition = await this.conditionsService.findById(ad.conditionId);
    const currency = await this.currencyService.findById(ad.currencyId);
    const size = await this.sizesService.findById(ad.sizeId);
    const delivery = await this.deliveryService.findById(ad.deliveryId);

    const transformedAdObject: TransformedAd = {
      name: ad.name,
      price: ad.price,
      description: ad.description,
      town: ad.town,
      telephone: ad.telephone,
      images: ad.images,
      category: {
        name: category.name,
        id: ad.categoryId,
      },
      brand: {
        name: brand.name,
        id: ad.brandId,
      },
      condition: {
        name: condition.name,
        id: ad.conditionId,
      },
      currency: {
        name: currency.name,
        currency: currency.currency,
        id: ad.currencyId,
      },
      size: {
        size: size.size,
        id: ad.sizeId,
      },
      delivery: {
        name: delivery.name,
        id: ad.deliveryId,
      },
      userId: ad.userId,
    };

    return transformedAdObject;
  }
}
