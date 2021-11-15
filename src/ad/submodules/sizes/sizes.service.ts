import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Types } from 'mongoose';
import { Size } from './schema/size.schema';
import { shoes } from './types/size.types';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { CategoryService } from '../category/category.service';

export class SizeWithId {
  _id: Types.ObjectId;
}

@Injectable()
export class SizesService {
  constructor(
    @InjectModel(Size.name)
    private readonly sizeRepository: Model<Size>,
    private categoryService: CategoryService,
  ) {}

  public async create(input: CreateSizeDto): Promise<Size> {
    const size = await new this.sizeRepository(input);
    await this.categoryService.findById(new Types.ObjectId(size.categoryId));
    await this.checkSizeFormat(input.size);
    return size.save();
  }

  public async findAll(): Promise<Array<Size>> {
    return await this.sizeRepository.find().exec();
  }

  public async findById(id: Types.ObjectId): Promise<Size> {
    const size = await this.sizeRepository.findById(id);
    if (size) return size;
    else throw new BadRequestException('This size is not exist!');
  }

  public async deleteById(id: string): Promise<Size> {
    const size = await this.sizeRepository.findByIdAndDelete(id);
    if (size) return size;
    throw new BadRequestException('This size is not exist!');
  }

  public async updateById(
    id: Types.ObjectId,
    postData: UpdateSizeDto,
  ): Promise<CreateSizeDto> {
    const size = await this.sizeRepository
      .findByIdAndUpdate(id, postData)
      .setOptions({ new: true });
    if (size) return size;
    else throw new BadRequestException('This size is not exist!');
  }

  public async checkSizeFormat(size: shoes | string): Promise<boolean> {
    if (typeof size == 'object') {
      if (size.eu && size.us && size.uk) return true;
      throw new BadRequestException('Invalid size format!');
    } else if (typeof size == 'string') return true;
    throw new BadRequestException('Invalid size format!');
  }

  public async findByUrlAndCategoryId(
    url: string,
    categoryId: Types.ObjectId,
  ): Promise<Array<Size & SizeWithId>> {
    let size: number | string;
    let sizeFilter = 'size';

    if (url.match(/\d+/g)) {
      const splittedUrl = url.split('-');
      sizeFilter += `.${splittedUrl[0]}`;
      size = Number(splittedUrl[1]);
    } else size = url;

    const filteredSize = await this.sizeRepository.aggregate([
      {
        $match: {
          categoryId: categoryId,
          [sizeFilter]: size,
        },
      },
    ]);

    if (filteredSize.length) return filteredSize;
    else throw new BadRequestException('This size is not exist!');
  }
}
