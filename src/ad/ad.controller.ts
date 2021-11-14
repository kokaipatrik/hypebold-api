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
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

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
  public async createAd(
    @Req() req: any,
    @Res() res: any,
    @Body() input: any,
  ) {
    try {
      await this.adService.create(input, req.user.id);
      return res.status(HttpStatus.OK).json({
        message: 'Ad has been created.',
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  @UseInterceptors(FilesInterceptor('image', 6, {
    dest: './images',
    fileFilter: ImageFileFilter,
    limits: {
      fileSize: 2097152,
    },
  }))
  @Post('upload-images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  public uploadFile(
    @UploadedFiles() image: Express.Multer.File,
  ) {
    return {
      files: image,
    };
  }

  @Get('images/:img')
  public getImage(@Param('img') image, @Res() res) {
    return res.sendFile(image, { root: './images' });
  }

  @Get('categoryUrl/:categoryUrl')
  public async getAdsByCategoryUrl(@Param('categoryUrl') categoryUrl, @Res() res) {
    try {
      const ads = await this.adService.getAdsByCategoryUrl(categoryUrl);
      return res.status(HttpStatus.OK).json({
        data: ads,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    } 
  }

  @Get('brandUrl/:brandUrl')
  public async getAdsByBrandUrl(@Param('brandUrl') brandUrl, @Res() res) {
    try {
      const ads = await this.adService.getAdsByBrandUrl(brandUrl);
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
