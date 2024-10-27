const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const multer = require('multer');
const passport = require("passport");
const session = require("express-session");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(`public`));

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_LOGIN,
        pass: process.env.GMAIL_PASSWORD
    },
});

app.get('/chats', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', `auth`, 'index.html'));
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log(`MongoDB connected`);
    })

const userSchema = new mongoose.Schema({
    login: String,
    email: String,
    password: String,
    filename: String,
    path: String,
    uploadDate: { type: Date, default: Date.now },
    chats: [String]
})

const User = mongoose.model("User", userSchema);

app.post('/sendConfirmationEmail', (req, res) => {
    let { email } = req.body;

    randomCode = Math.floor(Math.random() * (999999 - 100000) + 100000).toString();

    let mailOptions = {
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
});

app.post(`/auth/createUser`, (req, res) => {
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
            const token = jwt.sign({ login: login }, SECRET_KEY, { expiresIn: "1h" });
            const refreshToken = jwt.sign({ login: login }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
            res.json({ token, refreshToken });
        } else {
            res.json({ message: 'Wrong code' });
        }
    } else {
        res.sendStatus(500);
    }
})
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        req.user = user;
        next();
    });
}

app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a secure route', user: req.user });
});

app.get('/refresh', (req, res) => {
    const refreshToken = req.headers['refresh-token']?.split(' ')[1];

    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error('Refresh token verification error:', err);
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newToken = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "10s" });
        const newRefreshToken = jwt.sign({ id: user.id, username: user.username }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        res.json({ token: newToken, refreshToken: newRefreshToken });
    });
});


app.post('/auth/login', async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) {
        return res.status(400).send('Missing login or password');
    }

    try {
        const user = await User.findOne({ login });
        
        if (!user) {
            return res.sendStatus(401);
        }

        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ login: login }, SECRET_KEY, { expiresIn: "1h" });
            const refreshToken = jwt.sign({ login: login }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
            return res.json({ token, refreshToken });
        } else {
            return res.sendStatus(401);
        }

    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
});

app.get('/allUsers', async (req, res) => {
    try {
        const users = await User.find();

        res.send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {

    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const userId = req.body.userId;
    if (!userId) {
        return res.status(400).send('No user ID provided');
    }

    User.findByIdAndUpdate(userId, {
        filename: req.file.filename,
        path: req.file.path
    })
        .then(() => {
            res.json({ message: 'File uploaded and user updated successfully' });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error updating user');
        });

    console.log(req.file);
});

app.put('/chageName/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, { login: req.body.login })
        .then(() => {
            res.json({ message: "User updated successfully" });
        })
        .catch((err) => {
            console.log(err);
        })
});

const mainChatMessage = new mongoose.Schema({
    message: String,
    userId: String
})

const mainChat = mongoose.model("mainChatMessage", mainChatMessage);

let connectionUsers = 0;

io.on('connection', (socket) => {
    console.log('Користувач підключився');

    connectionUsers++;
    io.emit('connectionUsers', connectionUsers);

    socket.on('chat message', (data) => {
        const { message, userId, chatId } = data;
        console.log(chatId);
        if (chatId === `mainChat`) {
            mainChat.create({ message, userId, chatId });
        } else {
            Messages.create({ message, userId, chatId });
        }
        socket.emit('My message', { message, userId, chatId });
        socket.broadcast.emit('Other message', { message, userId, chatId });
    });

    socket.on('disconnect', () => {
        console.log('Користувач відключився');
        connectionUsers--;
        io.emit('connectionUsers', connectionUsers);
    });
});

app.get(`/mainChatMessages`, async (req, res) => {
    try {
        const messages = await mainChat.find();
        res.send(messages);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

const chat = new mongoose.Schema({
    nameChat: String
})

const Chats = mongoose.model("chats", chat);

app.post(`/createChat`, (req, res) => {
    const { nameChat, userId } = req.body;
    if (!nameChat) {
        return res.status(400).send('Missing nameChat');
    }

    const newChat = new Chats({ nameChat });
    newChat.save()
        .then((savedChat) => {
            return User.findByIdAndUpdate(
                userId,
                { $push: { chats: savedChat._id } },
                { new: true }
            );
        })
        .then(() => {
            res.sendStatus(201);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error creating chat or updating user');
        });
})

app.post(`/createUserChat`, (req, res) => {
    const { nameChat, usersId } = req.body;

    if (!nameChat || !usersId) {
        return res.status(400).send('Missing nameChat or usersId');
    }

    const chatName = nameChat.join(', ');

    const newChat = new Chats({ nameChat: chatName });

    newChat.save()
        .then((savedChat) => {
            return Promise.all(
                usersId.map(userId =>
                    User.findByIdAndUpdate(userId, { $push: { chats: savedChat._id } })
                )
            );
        })
        .then(() => {
            res.sendStatus(201);
        })
        .catch((err) => {
            console.error('Error creating chat or updating users:', err);
            res.status(500).send('Error creating chat or updating users');
        });
});


app.post(`/addChatToUser`, (req, res) => {
    const { userId, chatId } = req.body;
    if (!userId || !chatId) {
        return res.status(400).send('Missing userId or chatId');
    }

    User.findByIdAndUpdate(userId, { $push: { chats: chatId } })
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error adding chat to user');
        });
})

app.get(`/Allchats`, async (req, res) => {
    try {
        const chats = await Chats.find();
        res.send(chats);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

app.put(`/chats/:id`, async (req, res) => {
    try {
        const { nameChat, chatId } = req.body;
        if (!nameChat || !chatId) {
            return res.status(400).send('Missing nameChat');
        }

        const chat = await Chats.findByIdAndUpdate(chatId, { nameChat });
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

const message = new mongoose.Schema({
    message: String,
    chatId: String,
    userId: String
})

const Messages = mongoose.model("messages", message);

app.get(`/messages`, async (req, res) => {
    try {
        const messages = await Messages.find();
        res.send(messages);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
})

server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
