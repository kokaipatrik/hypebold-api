import { Controller, Get, Res, HttpStatus } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public getHello(): string {
    return this.appService.getHello();
  }

  @Get('config')
  public async getConfig(@Res() res): Promise<any> {
    try {
      const config = await this.appService.getConfig();
      return res.status(HttpStatus.OK).json({
        data: config,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }
}
