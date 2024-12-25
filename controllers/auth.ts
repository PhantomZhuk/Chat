import { User } from "../models/users";
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

let randomCode: string;

function authenticateToken(req, res, next): void {
    const token: string = req.cookies.token;
    if (!token) return res.status(401).send({ message: "Access token required" })

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token" });
        req.user = user;
        next();
    })
}

interface mailOptions {
    from: string,
    to: string,
    subject: string,
    text: string
}

export default {
    sendConfirmationEmail: async (req, res) => {
        let { email } = req.body;

        randomCode = Math.floor(Math.random() * (999999 - 100000) + 100000).toString();

        let mailOptions: mailOptions = {
            from: 'Chat',
            to: email,
            subject: 'Confirm your email',
            text: randomCode,
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Failed to send email' });
            } else {
                console.log(`Message was sent: ${info.response}`);
                return res.status(200).json({ message: 'Email sent successfully' });
            }
        });

        res.send({ message: 'Code sent' });
    },
    createUser: async (req, res) => {
        try {
            const { login, password, email, code } = req.body;
            if (login && password) {
                if (code === randomCode) {
                    const newUser = new User({
                        login,
                        password: bcrypt.hashSync(password, 10),
                        email,
                        filename: 'user-icon-on-transparent-background-free-png.webp',
                        path: 'uploads/user-icon-on-transparent-background-free-png.webp',
                        uploadDate: Date.now()
                    });
                    newUser.save();
                    const token: string = jwt.sign({ login: login }, SECRET_KEY, { expiresIn: "1h" });
                    const refreshToken: string = jwt.sign({ login: login }, REFRESH_TOKEN_SECRET_KEY, { expiresIn: "7d" });
                    res.json({ token, refreshToken });
                } else {
                    res.json({ message: 'Wrong code' });
                }
            } else {
                res.sendStatus(500);
            }
        } catch (error) { console.error(error); }
    },
    protected: [authenticateToken, (req, res) => {
        res.json({ message: 'This is a secure route', user: req.user });
    }],
    refresh: async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return res.status(401).json({ message: "No refresh token provided" });
            }

            jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY, (err, user) => {
                if (err) {
                    console.error('Refresh token verification error:', err);
                    return res.status(403).json({ message: "Invalid refresh token" });
                }

                const newToken: string = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "15m" });
                res.json({ token: newToken });
            });
        } catch (error) { console.error(error); }
    },
    login: async (req, res) => {
        const { login, password } = req.body;
        if (!login || !password) {
            return res.status(400).send('Missing login or password');
        }

        try {
            const user = await User.findOne({ login });

            if (!user) {
                return res.sendStatus(401);
            }

            if (bcrypt.compareSync(password, user.password!)) {
                const token: string = jwt.sign({ login: login }, SECRET_KEY, { expiresIn: "1h" });
                const refreshToken: string = jwt.sign({ login: login }, REFRESH_TOKEN_SECRET_KEY, { expiresIn: "7d" });
                return res.json({ token, refreshToken });
            } else {
                return res.sendStatus(401);
            }

        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    },
    allUsers: async (req, res) => {
        try {
            const users = await User.find();

            res.send(users);
        } catch (error) { console.error(error); }
    }
}