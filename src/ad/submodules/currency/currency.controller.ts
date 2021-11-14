import {
  Controller,
  Get,
  Post,
  Param,
  Res,
  Body,
  HttpStatus,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';

import { CurrencyService } from './currency.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { Types } from 'mongoose';

@Controller('ad/currency')
export class CurrencyController {
  constructor(private currencyService: CurrencyService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  public async createCurrency(@Res() res: any, @Body() input: any) {
    try {
      await this.currencyService.create(input);
      return res.status(HttpStatus.OK).json({
        message: 'Currency has been created.',
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  @Get('')
  public async getCurrencies(@Res() res: any) {
    try {
      const currencies = await this.currencyService.findAll();
      return res.status(HttpStatus.OK).json({
        data: currencies,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  @Get('/:url')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  public async getCurrencyByUrl(@Res() res: any, @Param('url') url: string) {
    try {
      const currency = await this.currencyService.findByUrl(url);
      return res.status(HttpStatus.OK).json({
        data: currency,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  @Put('/update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  public async updateCurrencyById(
    @Res() res: any,
    @Param('id') id: Types.ObjectId,
    @Body() input: UpdateCurrencyDto,
  ) {
    try {
      await this.currencyService.updateExist(id, input);
      const currency = await this.currencyService.updateById(id, input);
      return res.status(HttpStatus.OK).json({
        data: currency,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  public async deleteCurrencyById(@Res() res: any, @Param('id') id: string) {
    try {
      await this.currencyService.deleteById(id);
      return res.status(HttpStatus.OK).json({
        message: 'Currency has been successfully deleted.',
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }
}
