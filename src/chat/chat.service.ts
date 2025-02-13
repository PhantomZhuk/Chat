import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from 'src/schemas/chat.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from "src/schemas/user.schema"

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>, @InjectModel(User.name) private User: Model<User>) { }

  create(createChatDto: CreateChatDto) {
    const createdChat = new this.chatModel(createChatDto);
    return createdChat.save();
  }

  findUserChats(login: string) {
    return this.User.findOne({ login }).populate('chats').exec();
  }

  async joinChat(login: string, id: string) {
    const user = await this.User.findOne({ login }).exec();
    const chat = await this.chatModel.findOne({ _id: id }).exec();

    if (!user || !chat) {
      return;
    }

    user.chats.push(id);
    chat.users.push(user._id as string);

    await user.save();
    await chat.save();

    return [user, chat];
  }

  async deleteChat(login: string, id: string) {
    const chat = await this.chatModel.findOne({ _id: id }).exec();
    const user = await this.User.findOne({ login }).exec();

    if (!chat || !user) {
      return;
    }

    const adminChat = chat.admin === user._id;

    if (adminChat) {
      return this.chatModel.deleteOne({ _id: id }).exec();
    } else {
      return;
    }
  }

  async exitChat(login: string, id: string) {
    const user = await this.User.findOne({ login }).exec();
    const chat = await this.chatModel.findOne({ _id: id }).exec();

    if (!user || !chat) {
      return;
    }

    user.chats = user.chats.filter(chatId => chatId !== id);

    await user.save();

    chat.users = chat.users.filter(chatUserId => chatUserId !== user._id);

    await chat.save();
    return [user, chat];
  }

  getChats() {
    return this.chatModel.find().exec();
  }
}
