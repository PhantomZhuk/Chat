import { Users } from "../models/users";
import nodemailer from "nodemailer";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY: string = process.env.SECRET_KEY!;
const REFRESH_TOKEN_SECRET_KEY: string = process.env.REFRESH_TOKEN_SECRET!;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_LOGIN,
        pass: process.env.GMAIL_PASSWORD
    },
});
function authenticateToken(req, res, next): void {
    const token: string = req.cookies.token;
    if (!token) return res.status(401).send({ message: "Access token required" })

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token" });
        req.user = user;
        next();
    })
}

export default {

}