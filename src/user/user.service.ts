import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { generateVerificationCode, sendConfirmationEmail } from './email.utils';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async create(login: string, email: string, password: string): Promise<User> {
    const verificationCode = await generateVerificationCode();
    await sendConfirmationEmail(email, verificationCode);
    return new this.userModel({ login, email, password: await bcrypt.hash(password, 10), uploadDate: new Date().toISOString(), chats: [], verificationCode}).save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async confirmVerificationCode(email: string, code: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new Error('User not found');
    }
    if (user.verificationCode !== code) {
      throw new Error('Incorrect verification code');
    }
    user.verification = true;
    return user.save();
  }

  async resendVerificationCode(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new Error('User not found');
    }
    const verificationCode = generateVerificationCode();
    sendConfirmationEmail(email, verificationCode);
    user.verificationCode = verificationCode;
    return user.save();
  }

  async login(login: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ login }).exec();
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Incorrect password'); 
    }

    return user;
  }

  async getUserInfo(login: string): Promise<User> {
    const user = await this.userModel.findOne({ login }).exec();
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async saveFileToDatabase (file: Express.Multer.File, login: string): Promise<User> {
    const user = await this.userModel.findOne({ login }).exec();
    if (!user) {
      throw new Error('User not found');
    }
    const photo = `./uploads/${file.filename}`;
    user.photo = photo;
    return user.save();
  }

  async updateUserName(login: string, oldLogin: string): Promise<User> {
    console.log(login, oldLogin);
    const user = await this.userModel.findOne({ login: oldLogin }).exec();
    const allUsers = await this.userModel.find().exec();
    if (!user) {
      throw new Error('User not found');
    }

    if (allUsers.find(el => el.login === login)) {
      throw new Error('User with this login already exists');
    }
    user.login = login;
    return user.save();
  }
}