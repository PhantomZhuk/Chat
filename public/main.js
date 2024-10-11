const socket = io();
let userId = $.cookie('userToken');
let nameUser;

authorisationCheck(userId);

$('.sendMessageContainer').on('submit', (e) => {
    e.preventDefault();
    const message = $('#sendMessageInput').val();
    if (message) {
        socket.emit('chat message', { message, userId });
        $('#sendMessageInput').val('');
    }
});

socket.on('My message', (data) => {
    appendMessage('myMessage', nameUser, data.message);
    $('.messageContainer').animate({
        scrollTop: $('.messageContainer').prop('scrollHeight')
    }, 'slow');
});

socket.on('Other message', (data) => {
    getUserNameById(data.userId, (userName) => {
        appendMessage('otherMessage', userName, data.message);
        $('.messageContainer').animate({
            scrollTop: $('.messageContainer').prop('scrollHeight')
        }, 'slow');
    });
});

socket.on('connectionUsers', (connectionUsers) => {
    $(`.usersOnline`).text(`Online ${connectionUsers}`);
});

function authorisationCheck(id) {
    axios.get('/allUsers')
        .then((res) => {
            const user = res.data.find(el => el._id === id);
            if (!user) {
                window.location.href = '/auth';
            } else {
                nameUser = user.login;
            }
        });
}

function getUserNameById(id, callback) {
    axios.get('/allUsers')
        .then((res) => {
            const user = res.data.find(el => el._id === id);
            if (user) {
                callback(user.login);
            } else {
                callback('Unknown');
            }
        })
        .catch(() => callback('Unknown'));
}

function appendMessage(type, userName, message) {
    $('.messageContainer').append( `
        <div class="${type}">
            <div class="nameUser">${userName}</div>
            <div class="message">${message}</div>
        </div>
    `);
}
