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

import { SizesService } from './sizes.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateSizeDto } from './dto/update-size.dto';
import { Types } from 'mongoose';

@Controller('ad/sizes')
export class SizesController {
  constructor(readonly sizesService: SizesService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  public async createSize(@Res() res: any, @Body() input: any) {
    try {
      await this.sizesService.create(input);
      return res.status(HttpStatus.OK).json({
        message: 'Size has been created.',
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  @Get('')
  public async getSizes(@Res() res: any) {
    try {
      const sizes = await this.sizesService.findAll();
      return res.status(HttpStatus.OK).json({
        data: sizes,
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
  public async getSizeById(@Res() res: any, @Param('id') id: Types.ObjectId) {
    try {
      const size = await this.sizesService.findById(id);
      return res.status(HttpStatus.OK).json({
        data: size,
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
  public async updateSizeById(
    @Res() res: any,
    @Param('id') id: Types.ObjectId,
    @Body() input: UpdateSizeDto,
  ) {
    try {
      await this.sizesService.checkSizeFormat(input.size);
      const size = await this.sizesService.updateById(id, input);
      return res.status(HttpStatus.OK).json({
        data: size,
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
  public async deleteSizeById(@Res() res: any, @Param('id') id: string) {
    try {
      await this.sizesService.deleteById(id);
      return res.status(HttpStatus.OK).json({
        message: 'Size has been successfully deleted.',
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }
}
