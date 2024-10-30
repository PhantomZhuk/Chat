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
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Access token required" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token" });
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

        const newToken = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "15m" });
        res.json({ token: newToken });
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

app.post('/uploadUserIcon', upload.single('file'), (req, res) => {

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
    connectionUsers++;
    io.emit('connectionUsers', connectionUsers);

    socket.on('joinChat', (chatId) => {
        socket.join(chatId);
        console.log(`Користувач підключився до чату ${chatId}`);
    });

    socket.on('chat message', async (data) => {
        const { message, userId, chatId } = data;

        if (chatId === 'mainChat') {
            await mainChat.create({ message, userId, chatId });
        } else {
            try {
                const chat = await Chats.findById(chatId);
                if (chat) {
                    chat.messages.push({ message, userId });
                    await chat.save();
                } else {
                    console.error(`Чат з ID ${chatId} не знайдено`);
                }
            } catch (error) {
                console.error('Помилка при оновленні чату:', error);
            }
        }

        socket.to(chatId).emit('Other message', { message, userId, chatId });
        socket.emit('My message', { message, userId, chatId });
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

const chatShema = new mongoose.Schema({
    nameChat: String,
    filename: String,
    path: String,
    uploadDate: { type: Date, default: Date.now },
    admin: String,
    chatType: String,
    users: [String],
    messages: [
        {
            message: String,
            userId: mongoose.Schema.Types.ObjectId
        }
    ]
})

const Chats = mongoose.model("chats", chatShema);

app.post(`/createChat`, upload.single('file'), (req, res) => {
    const { nameChat, userId, chatType } = req.body;
    const file = req.file;

    if (!nameChat) {
        return res.status(400).send('Missing nameChat');
    }

    const filename = file ? file.filename : 'none';
    const path = file ? file.path : 'none';

    const newChat = new Chats({
        nameChat,
        chatType,
        admin: userId,
        filename,
        path
    });

    newChat.save()
        .then((savedChat) => {
            return Promise.all([
                User.findByIdAndUpdate(
                    userId,
                    { $push: { chats: savedChat._id } },
                    { new: true }
                ),
                Chats.findByIdAndUpdate(
                    savedChat._id,
                    { $push: { users: userId } },
                    { new: true }
                )
            ]);
        })
        .then(() => {
            res.sendStatus(201);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error creating chat or updating user');
        });
});

// app.post(`/createUserChat`, (req, res) => {
//     const { nameChat, usersId } = req.body;

//     if (!nameChat || !usersId) {
//         return res.status(400).send('Missing nameChat or usersId');
//     }

//     const chatName = nameChat.join(', ');

//     const newChat = new Chats({ 
//         nameChat: chatName,
//         filename: 'none',
//         path: 'none',
//         users: usersId,
//         chatType: 'private',
//         messages: []
//     });

//     newChat.save()
//         .then((savedChat) => {
//             return Promise.all(
//                 usersId.map(userId =>
//                     User.findByIdAndUpdate(userId, { $push: { chats: savedChat._id } })
//                 )
//             );
//         })
//         .then(() => {
//             res.sendStatus(201);
//         })
//         .catch((err) => {
//             console.error('Error creating chat or updating users:', err);
//             res.status(500).send('Error creating chat or updating users');
//         });
// });

app.post(`/createUserChat`, (req, res) => {
    const { nameChat, usersId } = req.body;

    if (!nameChat || !usersId) {
        return res.status(400).send('Missing nameChat or usersId');
    }

    const chatName = nameChat.join(', ');

    const newChat = new Chats({
        nameChat: chatName,
        filename: 'none',
        path: 'none',
        users: usersId,
        chatType: 'private',
        messages: []
    });

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
        })
})

app.post(`/addChatToUser`, (req, res) => {
    const { userId, chatId } = req.body;
    if (!userId || !chatId) {
        return res.status(400).send('Missing userId or chatId');
    }

    Promise.all([
        User.findByIdAndUpdate(userId, { $push: { chats: chatId } }),
        Chats.findByIdAndUpdate(chatId, { $push: { users: userId } })
    ])
        .then(() => {
            res.sendStatus(201);
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



server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
