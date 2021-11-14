import { Injectable, BadRequestException  } from '@nestjs/common';
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

  public async addAdIdToUserCollection(userId: Types.ObjectId, adId: Types.ObjectId): Promise<any> {
    await this.userService.findById(userId);
    const ad = await this.userService.pushAdIdToAds(userId, adId);

    if (ad) return ad;
    throw new BadRequestException('Push operation failed.');
  }

  public async getAdsByCategoryUrl(url: string): Promise<any> {
    const category = await this.categoryService.findByUrl(url);

    const ads = await this.adRepository.find({ categoryId: category._id }).exec();
    if (ads.length) return ads;
    throw new BadRequestException('This category is empty!');
  }

  public async getAdsByBrandUrl(url: string): Promise<any> {
    const category = await this.brandsService.findByUrl(url);

    const ads = await this.adRepository.find({ brandId: category._id }).exec();
    if (ads.length) return ads;
    throw new BadRequestException('This brand is empty!');
  }
}
