const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    document.getElementById('messages').appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('connectionUsers', (connectionUsers) => {
    const users = document.querySelector('.users');
    users.innerHTML = connectionUsers;
});