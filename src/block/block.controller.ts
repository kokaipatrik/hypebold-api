import { Body, Controller, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';

import { BlockService } from './block.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Types } from 'mongoose';
import { UpdateBlockDto } from './dto/update-block.dto';

@Controller('block')
export class BlockController {
  constructor(private blockService: BlockService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  public async createBlock(@Req() req: any, @Res() res: any, @Body() input: any) {
    try {
      const block = await this.blockService.create(input, req.user.id);
      await this.blockService.addIdToUserCollection(req.user.id, block._id);

      return res.status(HttpStatus.OK).json({
        message: 'Block has been created.',
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  @Put('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  public async createBlockById(
    @Res() res: any,
    @Param('id') id: Types.ObjectId,
    @Body() input: UpdateBlockDto,
  ) {
    try {
      await this.blockService.findById(id);
      const block = await this.blockService.updateById(id, input);
      return res.status(HttpStatus.OK).json({
        data: block,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }
}
