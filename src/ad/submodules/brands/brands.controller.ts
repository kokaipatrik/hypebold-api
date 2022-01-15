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

import { BrandsService } from './brands.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Types } from 'mongoose';

@Controller('ad/brands')
export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  public async createBrand(@Res() res: any, @Body() input: any) {
    try {
      await this.brandsService.create(input);
      return res.status(HttpStatus.OK).json({
        message: 'Brand has been created.',
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  @Get('')
  public async getBrands(@Res() res: any) {
    try {
      const brands = await this.brandsService.findAll();
      return res.status(HttpStatus.OK).json({
        data: brands,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  @Get('/:url')
  public async getBrandByUrl(@Res() res: any, @Param('url') url: string) {
    try {
      const brand = await this.brandsService.findByUrl(url);
      return res.status(HttpStatus.OK).json({
        data: brand,
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
  public async updateBrandById(
    @Res() res: any,
    @Param('id') id: Types.ObjectId,
    @Body() input: UpdateBrandDto,
  ) {
    try {
      await this.brandsService.updateExist(id, input);
      const brand = await this.brandsService.updateById(id, input);
      return res.status(HttpStatus.OK).json({
        data: brand,
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
  public async deleteBrandById(@Res() res: any, @Param('id') id: string) {
    try {
      await this.brandsService.deleteById(id);
      return res.status(HttpStatus.OK).json({
        message: 'Brand has been successfully deleted.',
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }
}
