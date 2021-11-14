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

import { CategoryService } from './category.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Types } from 'mongoose';

@Controller('ad/category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  public async createCategory(@Res() res: any, @Body() input: any) {
    try {
      await this.categoryService.create(input);
      return res.status(HttpStatus.OK).json({
        message: 'Category has been created.',
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  @Get('')
  public async getCategories(@Res() res: any) {
    try {
      const categories = await this.categoryService.findAll();
      return res.status(HttpStatus.OK).json({
        data: categories,
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
  public async getCategoryByUrl(@Res() res: any, @Param('url') url: string) {
    try {
      const category = await this.categoryService.findByUrl(url);
      return res.status(HttpStatus.OK).json({
        data: category,
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
  public async updateCategoryById(
    @Res() res: any,
    @Param('id') id: Types.ObjectId,
    @Body() input: UpdateCategoryDto,
  ) {
    try {
      await this.categoryService.updateExist(id, input);
      const category = await this.categoryService.updateById(id, input);
      return res.status(HttpStatus.OK).json({
        data: category,
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
  public async deleteCategoryById(@Res() res: any, @Param('id') id: string) {
    try {
      await this.categoryService.deleteById(id);
      return res.status(HttpStatus.OK).json({
        message: 'Category has been successfully deleted.',
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }
}
