import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Delivery } from './schema/delivery.schema';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectModel(Delivery.name)
    private readonly deliveryRepository: Model<Delivery>,
  ) {}

  public async create(input: CreateDeliveryDto): Promise<Delivery> {
    const delivery = await new this.deliveryRepository(input);
    await this.isDeliveryNameExist(delivery.name);
    await this.isDeliveryUrlExist(delivery.url);
    return delivery.save();
  }

  public async findAll(): Promise<Array<Delivery>> {
    return await this.deliveryRepository.find().exec();
  }

  public async findByUrl(url: string): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({ url: url });
    if (delivery) return delivery;
    else throw new BadRequestException('This delivery is not exist!');
  }

  public async findById(id: Types.ObjectId): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findById(id);
    if (delivery) return delivery;
    else throw new BadRequestException('This delivery is not exist!');
  }

  public async deleteById(id: string): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findByIdAndDelete(id);
    if (delivery) return delivery;
    throw new BadRequestException('This delivery is not exist!');
  }

  public async updateById(
    id: Types.ObjectId,
    postData: UpdateDeliveryDto,
  ): Promise<CreateDeliveryDto> {
    const delivery = await this.deliveryRepository
      .findByIdAndUpdate(id, postData)
      .setOptions({ new: true });
    if (delivery) return delivery;
    else throw new BadRequestException('This delivery is not exist!');
  }

  private async isDeliveryNameExist(name: string): Promise<void> {
    const delivery = await this.deliveryRepository.findOne({ name: name });
    if (delivery)
      throw new BadRequestException('This delivery name is already exist!');
  }

  private async isDeliveryUrlExist(url: string): Promise<void> {
    const delivery = await this.deliveryRepository.findOne({ url: url });
    if (delivery)
      throw new BadRequestException('This delivery url is already exist!');
  }

  public async updateExist(
    id: Types.ObjectId,
    postData: UpdateDeliveryDto,
  ): Promise<void> {
    const delivery = await this.findById(id);

    if (delivery.name != postData.name)
      await this.isDeliveryNameExist(postData.name);
    if (delivery.url != postData.url)
      await this.isDeliveryUrlExist(postData.url);
  }
}
