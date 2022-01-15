import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Res,
  Body,
  HttpStatus,
  UseGuards,
  Put,
  Delete,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Multer } from 'multer';

import { AdService } from './ad.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ImageFileFilter } from './utils/file-upload.util';

@Controller('ad')
export class AdController {
  constructor(private adService: AdService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  public async createAd(@Req() req: any, @Res() res: any, @Body() input: any) {
    try {
      const ad = await this.adService.create(input, req.user.id);
      await this.adService.addAdIdToUserCollection(req.user.id, ad._id);

      return res.status(HttpStatus.OK).json({
        message: 'Ad has been created.',
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  @UseInterceptors(
    FilesInterceptor('image', 6, {
      dest: './images',
      fileFilter: ImageFileFilter,
      limits: {
        fileSize: 2097152,
      },
    }),
  )
  @Post('upload-images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  public uploadFile(@UploadedFiles() image: Express.Multer.File) {
    return {
      files: image,
    };
  }

  @Get('images/:img')
  public getImage(@Param('img') image, @Res() res) {
    return res.sendFile(image, { root: './images' });
  }

  @Get('queries?')
  public async getAdsByQueries(
    @Query('category') category,
    @Query('brand') brand,
    @Query('condition') condition,
    @Query('size') size,
    @Query('page') page,
    @Query('limit') limit,
    @Res() res,
  ) {
    try {
      const ads = await this.adService.getAdsByQueries(
        category,
        brand,
        condition,
        size,
        page,
        limit,
      );
      return res.status(HttpStatus.OK).json({
        data: ads,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }
}
