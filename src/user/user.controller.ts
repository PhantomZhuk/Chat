import { Controller, Get, Post, Body, Res, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { AuthGuard } from '../common/guards/auth.guard';
import { createTokens } from './email.utils';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('confirmVerificationCode')
  async confirmVerificationCode(@Body() body: { email: string, code: string }) {
    return this.userService.confirmVerificationCode(body.email, body.code);
  }

  @Post('create')
  async createUser(@Body() body: CreateUserDto, @Res() res: Response) {
    const { token, refreshToken } = createTokens(body.login);

    res.cookie('token', token, { httpOnly: true, secure: true })
      .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
      .sendStatus(201);

    return this.userService.create(body.login, body.email, body.password);
  }

  @Get('all')
  async getUsers() {
    return this.userService.findAll();
  }

  @Post('login')
  async login(@Body() body: { login: string, password: string }, @Res() res: Response) {
    const { token, refreshToken } = createTokens(body.login);

    res.cookie('token', token, { httpOnly: true, secure: true })
      .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
      .sendStatus(201);
      
    return this.userService.login(body.login, body.password);
  }

  @Post('resendVerificationCode')
  async resendVerificationCode(@Body() body: { email: string }) {
    return this.userService.resendVerificationCode(body.email);
  }

  @Get(`getUserInfo`)
  @UseGuards(AuthGuard)
  async getUserInfo(@Req() req: any) {
    return this.userService.getUserInfo(req.user.login);
  }
}