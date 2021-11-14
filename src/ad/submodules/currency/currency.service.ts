import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Currency } from './schema/currency.schema';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectModel(Currency.name)
    private readonly currencyRepository: Model<Currency>,
  ) {}

  public async create(input: CreateCurrencyDto): Promise<Currency> {
    const currency = await new this.currencyRepository(input);
    await this.isCurrencyNameExist(input.name);
    await this.isCurrencyUrlExist(input.url);
    await this.isCurrencyExist(input.currency);
    return currency.save();
  }

  public async findAll(): Promise<Array<Currency>> {
    return await this.currencyRepository.find().exec();
  }

  public async findByUrl(url: string): Promise<Currency> {
    const currency = await this.currencyRepository.findOne({ url: url });
    if (currency) return currency;
    else throw new BadRequestException('This currency is not exist!');
  }

  public async findById(id: Types.ObjectId): Promise<Currency> {
    const currency = await this.currencyRepository.findById(id);
    if (currency) return currency;
    else throw new BadRequestException('This currency is not exist!');
  }

  public async deleteById(id: string): Promise<Currency> {
    const currency = await this.currencyRepository.findByIdAndDelete(id);
    if (currency) return currency;
    throw new BadRequestException('This currency is not exist!');
  }

  public async updateById(
    id: Types.ObjectId,
    postData: UpdateCurrencyDto,
  ): Promise<CreateCurrencyDto> {
    const currency = await this.currencyRepository
      .findByIdAndUpdate(id, postData)
      .setOptions({ new: true });
    if (currency) return currency;
    else throw new BadRequestException('This currency is not exist!');
  }

  private async isCurrencyNameExist(name: string): Promise<void> {
    const currency = await this.currencyRepository.findOne({ name: name });
    if (currency)
      throw new BadRequestException('This currency name is already exist!');
  }

  private async isCurrencyUrlExist(url: string): Promise<void> {
    const currency = await this.currencyRepository.findOne({ url: url });
    if (currency)
      throw new BadRequestException('This currency url is already exist!');
  }

  private async isCurrencyExist(curr: string): Promise<void> {
    const currency = await this.currencyRepository.findOne({ currency: curr });
    if (currency)
      throw new BadRequestException('This currency is already exist!');
  }

  public async updateExist(
    id: Types.ObjectId,
    postData: UpdateCurrencyDto,
  ): Promise<void> {
    const currency = await this.findById(id);

    if (currency.name != postData.name)
      await this.isCurrencyNameExist(postData.name);
    if (currency.url != postData.url)
      await this.isCurrencyUrlExist(postData.url);
    if (currency.currency != postData.currency)
      await this.isCurrencyExist(postData.currency);
  }
}
