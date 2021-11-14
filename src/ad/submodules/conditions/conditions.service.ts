import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Condition } from './schema/condition.schema';
import { CreateConditionDto } from './dto/create-condition.dto';
import { UpdateConditionDto } from './dto/update-condition.dto';

@Injectable()
export class ConditionsService {
  constructor(
    @InjectModel(Condition.name)
    private readonly conditionRepository: Model<Condition>,
  ) {}

  public async create(input: CreateConditionDto): Promise<Condition> {
    const condition = await new this.conditionRepository(input);
    await this.isConditionNameExist(condition.name);
    await this.isConditionUrlExist(condition.url);
    return condition.save();
  }

  public async findAll(): Promise<Array<Condition>> {
    return await this.conditionRepository.find().exec();
  }

  public async findByUrl(url: string): Promise<Condition> {
    const condition = await this.conditionRepository.findOne({ url: url });
    if (condition) return condition;
    else throw new BadRequestException('This condition is not exist!');
  }

  public async findById(id: Types.ObjectId): Promise<Condition> {
    const condition = await this.conditionRepository.findById(id);
    if (condition) return condition;
    else throw new BadRequestException('This condition is not exist!');
  }

  public async deleteById(id: string): Promise<Condition> {
    const condition = await this.conditionRepository.findByIdAndDelete(id);
    if (condition) return condition;
    throw new BadRequestException('This condition is not exist!');
  }

  public async updateById(
    id: Types.ObjectId,
    postData: UpdateConditionDto,
  ): Promise<CreateConditionDto> {
    const condition = await this.conditionRepository
      .findByIdAndUpdate(id, postData)
      .setOptions({ new: true });
    if (condition) return condition;
    else throw new BadRequestException('This condition is not exist!');
  }

  private async isConditionNameExist(name: string): Promise<void> {
    const condition = await this.conditionRepository.findOne({ name: name });
    if (condition)
      throw new BadRequestException('This condition is already exist!');
  }

  private async isConditionUrlExist(url: string): Promise<void> {
    const condition = await this.conditionRepository.findOne({ url: url });
    if (condition)
      throw new BadRequestException('This condition is already exist!');
  }

  public async updateExist(
    id: Types.ObjectId,
    postData: UpdateConditionDto,
  ): Promise<void> {
    const condition = await this.findById(id);

    if (condition.name != postData.name)
      await this.isConditionNameExist(postData.name);
    if (condition.url != postData.url)
      await this.isConditionUrlExist(postData.url);
  }
}
