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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(`public`));


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
    password: String
})

const User = mongoose.model("User", userSchema);

app.post(`/auth/createUser`, (req, res) => {
    const { login, password } = req.body;
    if (login && password) {
        const newUser = new User({ login, password });
        newUser.save();
        res.sendStatus(201);
    }else {
        res.sendStatus(500);
    }
})

app.post('/auth/login', async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) {
        return res.status(400).send('Missing login or password');
    }

    try {
        const user = await User.findOne({ login, password });

        if (user) {
            res.sendStatus(200); 
        } else {
            res.sendStatus(401);
        }

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
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


let connectionUsers = 0;

io.on('connection', (socket) => {
    console.log('Користувач підключився');

    connectionUsers++;
    io.emit('connectionUsers', connectionUsers);

    socket.on('chat message', (data) => {
        const { message, userId } = data;
        socket.emit('My message', { message, userId });
        socket.broadcast.emit('Other message', { message, userId });
    });

    socket.on('disconnect', () => {
        console.log('Користувач відключився');
        connectionUsers--;
        io.emit('connectionUsers', connectionUsers);
    });
});

server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
