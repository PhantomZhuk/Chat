import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import passport from "passport";
import session from "express-session";
// import localStrategy from "passport-local";
// import GoogleStrategy from "passport-google-oauth20";
import { Server } from 'socket.io';
import { meinChatMessages } from './models/messages';
import { Chats } from './models/chats';

import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express()
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(express.static(`public`))
    .use(cors())
    .use(session({
        secret: process.env.SECRET_KEY!,
        resave: false,
        saveUninitialized: false
    }))
    .use(passport.initialize())
    .use(passport.session());

const io = new Server(http.createServer(app));


let connectionUsers = 0;

mongoose.connect(process.env.MONGODB_URI!)
    .then(() => {
        console.log(`MongoDB connected`);
    })

io.on('connection', (socket) => {
    connectionUsers++;
    io.emit('connectionUsers', connectionUsers);

    socket.on('joinChat', (chatId) => {
        socket.join(chatId);
        console.log(`Користувач підключився до чату ${chatId}`);
    });

    socket.on('chat message', async (data) => {
        const { message, userId, chatId } = data;

        if (!message || !userId || !chatId) {
            socket.emit('error', 'Повідомлення, userId або chatId не вказані');
            return;
        }

        try {
            if (chatId === 'mainChat') {
                const newMessage = await meinChatMessages.create({ message, userId, chatId });
                const messageId = newMessage._id;

                socket.to(chatId).emit('Other message', { message, userId, chatId, messageId });
                socket.emit('My message', { message, userId, chatId, messageId });
            } else {
                const chat = await Chats.findById(chatId);
                if (chat) {
                    const newMessage = { message, userId };
                    chat.messages.push(newMessage);
                    await chat.save();

                    const messageId = chat.messages[chat.messages.length - 1]._id;

                    socket.to(chatId).emit('Other message', { message, userId, chatId, messageId });
                    socket.emit('My message', { message, userId, chatId, messageId });
                } else {
                    console.error(`Чат з ID ${chatId} не знайдено`);
                    socket.emit('error', `Чат з ID ${chatId} не знайдено`);
                }
            }
        } catch (error) {
            console.error('Помилка при оновленні чату:', error);
            socket.emit('error', 'Виникла помилка при обробці повідомлення');
        }
    });

    socket.on('disconnect', () => {
        console.log('Користувач відключився');
        connectionUsers--;
        io.emit('connectionUsers', connectionUsers);
    });
});


app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
