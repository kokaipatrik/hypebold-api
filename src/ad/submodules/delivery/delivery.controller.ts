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

import { DeliveryService } from './delivery.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { Types } from 'mongoose';

@Controller('ad/delivery')
export class DeliveryController {
  constructor(readonly deliveryService: DeliveryService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  public async createDelivery(@Res() res: any, @Body() input: any) {
    try {
      await this.deliveryService.create(input);
      return res.status(HttpStatus.OK).json({
        message: 'Delivery has been created.',
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  @Get('')
  public async getDeliveries(@Res() res: any) {
    try {
      const deliveries = await this.deliveryService.findAll();
      return res.status(HttpStatus.OK).json({
        data: deliveries,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  public async getDeliveryById(
    @Res() res: any,
    @Param('id') id: Types.ObjectId,
  ) {
    try {
      const delivery = await this.deliveryService.findById(id);
      return res.status(HttpStatus.OK).json({
        data: delivery,
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
  public async updateDeliveryById(
    @Res() res: any,
    @Param('id') id: Types.ObjectId,
    @Body() input: UpdateDeliveryDto,
  ) {
    try {
      await this.deliveryService.updateExist(id, input);
      const delivery = await this.deliveryService.updateById(id, input);
      return res.status(HttpStatus.OK).json({
        data: delivery,
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
  public async deleteDeliveryById(@Res() res: any, @Param('id') id: string) {
    try {
      await this.deliveryService.deleteById(id);
      return res.status(HttpStatus.OK).json({
        message: 'Delivery has been successfully deleted.',
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }
}
