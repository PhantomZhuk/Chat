import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { join } from 'path';
import { AuthGuard } from './common/guards/auth.guard';

@Controller()
export class AppController {
  @Get('/')
  getHome(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  }

  @Get('/chats')
  @UseGuards(AuthGuard)
  getChats(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  }

  @Get('/auth')
  getAuth(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'auth' ,'index.html'));
  }
}
