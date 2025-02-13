import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Chat extends Document {
    @Prop({ required: true })
    nameChat: string;

    @Prop({ required: true })
    photo: string;

    @Prop({ required: true })
    status: string;

    @Prop({ required: true })
    admin: string;
    
    @Prop({ required: true })
    messages: string[];

    @Prop({ required: true })
    users: string[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);