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
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import authRouter from "./routers/auth";
import chatRouter from "./routers/chat";
import userRouter from "./routers/user";

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
    .use(passport.session())
    .use(cookieParser())
    .use(`/auth`, authRouter)
    .use(`/chat`, chatRouter)
    .use(`/user`, userRouter)

const io = new Server(http.createServer(app));

mongoose.connect(process.env.MONGODB_URI!)
    .then(() => {
        console.log(`MongoDB connected`);
    })

let connectionUsers = 0;

io.on ('connection', (socket) => {
    connectionUsers++;
    io.emit('connectionUsers', connectionUsers);
    socket.on('joinChat', (chatId) => {
        socket.join(chatId);
        console.log(`Користувач підключився до чату ${chatId}`);
    });
})

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
