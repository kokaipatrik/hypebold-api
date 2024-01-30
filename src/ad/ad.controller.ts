import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Res,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Put,
  Delete,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

import { AdService } from './ad.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

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
    FilesInterceptor('images', 6, {
      fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
        }
      },
      limits: {
        fileSize: 2097152,
      },
      storage: diskStorage({
        destination: './images',
        filename: (req: any, file: any, cb: any) => {
          if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            cb(new Error('Only image files are allowed!'), false);
          }

          cb(null, `${uuid()}${extname(file.originalname)}`);
      },
      })
    }),
  )
  @Post('upload-images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  public uploadFile(@UploadedFiles() images: Array<Express.Multer.File>) {
    return images.map(file => file.filename);
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
