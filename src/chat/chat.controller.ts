import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    this.chatService.create(createChatDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findUserChats(@Req() req) {
    return this.chatService.findUserChats(req.user.login);
  }

  @Get()
  @UseGuards(AuthGuard)
  getChats() {
    return this.chatService.getChats();
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  deleteChat(@Req() req) {
    return this.chatService.deleteChat(req.user.login, req.params.id);
  }

  @Put(":id")
  @UseGuards(AuthGuard)
  exitChat(@Req() req) {
    return this.chatService.exitChat(req.user.login, req.params.id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  joinChat(@Req() req) {
    return this.chatService.joinChat(req.user.login, req.params.id);
  }
}
