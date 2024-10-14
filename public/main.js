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
    $('.messageContainer').append(`
        <div class="${type}">
            <div class="nameUser">${userName}</div>
            <div class="message">${message}</div>
        </div>
    `);
}

$(`#MenuBtn`).click(() => { 
    if ($(`#MenuBtn`).hasClass(`fa-bars`)) {
        $(`.mainChatContainer`).css('margin-top', '10px');
        $(`header`).css('width', '300px');
        $(`.mainChat`).css('background-color', '#2d5362');
        $(`.mainChat`).css('justify-content', 'flex-start');
        $(`.mainChatIcon`).css('margin', '10px');
        $(`.mainChatName`).css('display', 'flex');
        $(`.addChatBtn`).css('width', '90%');
        $(`.menuBtnContainer`).css(`justify-content`, `space-between`);
        $(`.menuBtnContainer`).css(`padding`, `0 20px`);
        $(`.accountContainer`).css(`display`, `flex`);
        $(`.settingBtn`).css(`justify-content`, `flex-start`);
        $(`.settingBtn`).css(`padding`, `0 20px`);
        $(`#MenuBtn`).addClass(`fa-xmark`);
        $(`#MenuBtn`).removeClass(`fa-bars`);
        $(`#searchInput`).css(`display`, `flex`);
        $(`.searchContainer`).css(`justify-content`, `space-between`);
        $(`#searchBtn`).css(`width`, `40px`);
        $(`#searchBtn`).css(`height`, `40px`);
        $(`.settingsText`).css(`display`, `flex`);
    }else if ($(`#MenuBtn`).hasClass(`fa-xmark`)) {
        $(`.mainChatContainer`).css('margin-top', '0');
        $(`header`).css('width', '100px');
        $(`.mainChat`).css('background-color', '#264653');
        $(`.mainChat`).css('justify-content', 'center');
        $(`.mainChatIcon`).css('margin', '0');
        $(`.mainChatName`).css('display', 'none');
        $(`.addChatBtn`).css('width', '65px');
        $(`.menuBtnContainer`).css(`justify-content`, `center`);
        $(`.menuBtnContainer`).css(`padding`, `0`);
        $(`.accountContainer`).css(`display`, `none`);
        $(`.settingBtn`).css(`justify-content`, `center`);
        $(`.settingBtn`).css(`padding`, `0`);
        $(`#MenuBtn`).addClass(`fa-bars`);
        $(`#MenuBtn`).removeClass(`fa-xmark`);
        $(`#searchInput`).css(`display`, `none`);
        $(`.searchContainer`).css(`justify-content`, `center`);
        $(`#searchBtn`).css(`width`, `65px`);
        $(`#searchBtn`).css(`height`, `65px`);
        $(`#searchBtn`).addClass(`openMenu`);
        $(`#searchBtn`).removeClass(`search`);
        $(`.settingsText`).css(`display`, `none`);
    }
});

$(`#searchBtn`).click(() => {
    if($(`#searchBtn`).hasClass(`openMenu`)) {
        $(`.mainChatContainer`).css('margin-top', '10px');
        $(`header`).css('width', '300px');
        $(`.mainChat`).css('background-color', '#2d5362');
        $(`.mainChat`).css('justify-content', 'flex-start');
        $(`.mainChatIcon`).css('margin', '10px');
        $(`.mainChatName`).css('display', 'flex');
        $(`.addChatBtn`).css('width', '90%');
        $(`.menuBtnContainer`).css(`justify-content`, `space-between`);
        $(`.menuBtnContainer`).css(`padding`, `0 20px`);
        $(`.accountContainer`).css(`display`, `flex`);
        $(`.settingBtn`).css(`justify-content`, `flex-start`);
        $(`.settingBtn`).css(`padding`, `0 20px`);
        $(`#MenuBtn`).addClass(`fa-xmark`);
        $(`#MenuBtn`).removeClass(`fa-bars`);
        $(`#searchInput`).css(`display`, `flex`);
        $(`.searchContainer`).css(`justify-content`, `space-between`);
        $(`#searchBtn`).css(`width`, `40px`);
        $(`#searchBtn`).css(`height`, `40px`);
        $(`#searchBtn`).removeClass(`openMenu`);
        $(`#searchBtn`).addClass(`search`);
    }else if($(`#MenuBtn`).hasClass(`fa-xmark`)) {
        console.log(`Search button clicked`);
    }
});

$(`.accountContainer`).click(()=>{
    $(`.profileContainer`).css(`display`, `flex`);
    $(`.wrap`).css(`filter`, `brightness(0.7)`);
});

$(`.closeProfileBtn`).click(()=>{
    $(`.profileContainer`).css(`display`, `none`);
    $(`.wrap`).css(`filter`, `brightness(1)`);
})

$(`.openChangeNameContainer`).click(()=>{
    $(`.changeNameContainer`).css(`display`, `flex`);
    $(`.profileContainer`).css(`display`, `none`);
    $(`.wrap`).css(`filter`, `brightness(0.7)`);
})

$(`#cancelNameBtn`).click(()=>{
    $(`.changeNameContainer`).css(`display`, `none`);
    $(`.profileContainer`).css(`display`, `flex`);
    $(`.wrap`).css(`filter`, `brightness(1)`);
})

$(`.openChangeProfileImg`).click(()=>{
    $(`.changeProfileImgContainer`).css(`display`, `flex`);
    $(`.profileContainer`).css(`display`, `none`);
    $(`.wrap`).css(`filter`, `brightness(0.7)`);
})

$(`.closeImgBtn`).click(()=>{
    $(`.changeProfileImgContainer`).css(`display`, `none`);
    $(`.profileContainer`).css(`display`, `flex`);
    $(`.wrap`).css(`filter`, `brightness(1)`);
})