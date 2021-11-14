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

import { ConditionsService } from './conditions.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateConditionDto } from './dto/update-condition.dto';
import { Types } from 'mongoose';

@Controller('ad/conditions')
export class ConditionsController {
  constructor(private conditionsService: ConditionsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  public async createCondition(@Res() res: any, @Body() input: any) {
    try {
      await this.conditionsService.create(input);
      return res.status(HttpStatus.OK).json({
        message: 'Condition has been created.',
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  @Get('')
  public async getConditions(@Res() res: any) {
    try {
      const conditions = await this.conditionsService.findAll();
      return res.status(HttpStatus.OK).json({
        data: conditions,
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
  public async getConditionByUrl(@Res() res: any, @Param('url') url: string) {
    try {
      const condition = await this.conditionsService.findByUrl(url);
      return res.status(HttpStatus.OK).json({
        data: condition,
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
  public async updateConditionById(
    @Res() res: any,
    @Param('id') id: Types.ObjectId,
    @Body() input: UpdateConditionDto,
  ) {
    try {
      await this.conditionsService.updateExist(id, input);
      const condition = await this.conditionsService.updateById(id, input);
      return res.status(HttpStatus.OK).json({
        data: condition,
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
  public async deleteConditionById(@Res() res: any, @Param('id') id: string) {
    try {
      await this.conditionsService.deleteById(id);
      return res.status(HttpStatus.OK).json({
        message: 'Condition has been successfully deleted.',
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }
}
