import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
    @Prop({ required: true })
    login: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true, default: 'none' })
    photo: string;

    @Prop({ required: true })
    uploadDate: Date;

    @Prop({ required: true })
    verificationCode: string;

    @Prop({ default: false })
    verification: boolean;

    @Prop({ required: true, default: [] })
    chats: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
