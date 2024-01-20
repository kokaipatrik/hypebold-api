import { Body, Controller, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';

import { BlockService } from './block.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

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
}
