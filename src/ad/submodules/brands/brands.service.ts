import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Brand } from './schema/brand.schema';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

export class BrandWithId {
  _id: Types.ObjectId;
}

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand.name)
    private readonly brandRepository: Model<Brand>,
  ) {}

  public async create(input: CreateBrandDto): Promise<Brand> {
    const brand = await new this.brandRepository(input);
    await this.isBrandNameExist(brand.name);
    await this.isBrandUrlExist(brand.url);
    return brand.save();
  }

  public async findAll(): Promise<Array<Brand>> {
    return await this.brandRepository.find().exec();
  }

  public async findByUrl(url: string): Promise<Brand & BrandWithId> {
    const brand = await this.brandRepository.findOne({ url: url });
    if (brand) return brand;
    else throw new BadRequestException('This brand is not exist!');
  }

  public async findById(id: Types.ObjectId): Promise<Brand> {
    const brand = await this.brandRepository.findById(id);
    if (brand) return brand;
    else throw new BadRequestException('This brand is not exist!');
  }

  public async deleteById(id: string): Promise<Brand> {
    const brand = await this.brandRepository.findByIdAndDelete(id);
    if (brand) return brand;
    throw new BadRequestException('This brand is not exist!');
  }

  public async updateById(
    id: Types.ObjectId,
    postData: UpdateBrandDto,
  ): Promise<CreateBrandDto> {
    const brand = await this.brandRepository
      .findByIdAndUpdate(id, postData)
      .setOptions({ new: true });
    if (brand) return brand;
    else throw new BadRequestException('This brand is not exist!');
  }

  private async isBrandNameExist(name: string): Promise<void> {
    const brand = await this.brandRepository.findOne({ name: name });
    if (brand) throw new BadRequestException('This brand is already exist!');
  }

  private async isBrandUrlExist(url: string): Promise<void> {
    const brand = await this.brandRepository.findOne({ url: url });
    if (brand) throw new BadRequestException('This brand is already exist!');
  }

  public async updateExist(
    id: Types.ObjectId,
    postData: UpdateBrandDto,
  ): Promise<void> {
    const brand = await this.findById(id);

    if (brand.name != postData.name) await this.isBrandNameExist(postData.name);
    if (brand.url != postData.url) await this.isBrandUrlExist(postData.url);
  }
}
