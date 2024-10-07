const socket = io();
$('.sendMessageContainer').on('submit', (e) => {
    e.preventDefault();
    if ($('#sendMessageInput').val()) {
        socket.emit('chat message', $('#sendMessageInput').val());
        $('#sendMessageInput').val('');
    }
});

socket.on('My message', (msg) => {
    $('.messageContainer').append(`
        <div class="myMessage">${msg}</div>
    `);
    $(window).scrollTop($(document).height());
});

socket.on ('Other message', (msg) => {
    $('.messageContainer').append(`
        <div class="otherMessage">${msg}</div>
    `);
    $(window).scrollTop($(document).height());
});

socket.on('connectionUsers', (connectionUsers) => {
    $(`.usersOnline`).text(`Online ${connectionUsers}`);
});