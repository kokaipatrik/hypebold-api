import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Category } from './schema/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

export class CategoryWithId {
  _id: Types.ObjectId;
}

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryRepository: Model<Category>,
  ) {}

  public async create(input: CreateCategoryDto): Promise<Category> {
    const category = await new this.categoryRepository(input);
    await this.isCategoryNameExist(category.name);
    await this.isCategoryUrlExist(category.url);
    return category.save();
  }

  public async findAll(): Promise<Array<Category>> {
    return await this.categoryRepository.find().exec();
  }

  public async findByUrl(url: string): Promise<Category & CategoryWithId> {
    const category = await this.categoryRepository.findOne({ url: url });
    if (category) return category;
    else throw new BadRequestException('This category is not exist!');
  }

  public async findById(id: Types.ObjectId): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (category) return category;
    else throw new BadRequestException('This category is not exist!');
  }

  public async deleteById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findByIdAndDelete(id);
    if (category) return category;
    throw new BadRequestException('This category is not exist!');
  }

  public async updateById(
    id: Types.ObjectId,
    postData: UpdateCategoryDto,
  ): Promise<CreateCategoryDto> {
    const category = await this.categoryRepository
      .findByIdAndUpdate(id, postData)
      .setOptions({ new: true });
    if (category) return category;
    else throw new BadRequestException('This category is not exist!');
  }

  private async isCategoryNameExist(name: string): Promise<void> {
    const category = await this.categoryRepository.findOne({ name: name });
    if (category)
      throw new BadRequestException('This category is already exist!');
  }

  private async isCategoryUrlExist(url: string): Promise<void> {
    const category = await this.categoryRepository.findOne({ url: url });
    if (category)
      throw new BadRequestException('This category is already exist!');
  }

  public async updateExist(
    id: Types.ObjectId,
    postData: UpdateCategoryDto,
  ): Promise<void> {
    const category = await this.findById(id);

    if (category.name != postData.name)
      await this.isCategoryNameExist(postData.name);
    if (category.url != postData.url)
      await this.isCategoryUrlExist(postData.url);
  }
}
