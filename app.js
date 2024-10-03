const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let connectionUsers = 0;

io.on('connection', (socket) => {
    console.log('Користувач підключився');

    connectionUsers++;
    io.emit('connectionUsers', connectionUsers);

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Користувач відключився');
        connectionUsers--;
        io.emit('connectionUsers', connectionUsers);
    });
});

server.listen(3000, () => {
    console.log('listening on 3000');
});
