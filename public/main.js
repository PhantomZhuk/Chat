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
    axios.get(`/allUsers`)
        .then((res) => {
            const user = res.data.find(el => el._id === userId);
            if (user) {
                const originalPath = user.path;
                const transformedPath = originalPath
                    .replace('public\\', './')
                    .replace(/\\/g, '/');
                appendMessage('myMessage', nameUser, data.message, transformedPath);
                $('.messageContainer').animate({
                    scrollTop: $('.messageContainer').prop('scrollHeight')
                }, 'slow');
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

socket.on('Other message', (data) => {
    axios.get(`/allUsers`)
        .then((res) => {
            const user = res.data.find(el => el._id === data.userId);
            if (user) {
                const originalPath = user.path;
                const transformedPath = originalPath
                    .replace('public\\', './')
                    .replace(/\\/g, '/');
                getUserNameById(data.userId, (userName) => {
                    appendMessage('otherMessage', userName, data.message, transformedPath);
                    $('.messageContainer').animate({
                        scrollTop: $('.messageContainer').prop('scrollHeight')
                    }, 'slow');
                });
            }
        })
        .catch((err) => {
            console.log(err);
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

function appendMessage(type, userName, message, photoUrl) {
    $('.messageContainer').append(`
        <div class="${type}">
            <div class="iconContainer">
                <div class="icon" style="background-image: url('${photoUrl}');"></div>
            </div>
            <div class="nameContainer">
                <div class="nameUser">${userName}</div>
                <div class="message">${message}</div>
            </div>
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
    } else if ($(`#MenuBtn`).hasClass(`fa-xmark`)) {
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
    if ($(`#searchBtn`).hasClass(`openMenu`)) {
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
    } else if ($(`#MenuBtn`).hasClass(`fa-xmark`)) {
        console.log(`Search button clicked`);
    }
});

$(`.accountContainer`).click(() => {
    $(`.profileContainer`).css(`display`, `flex`);
    $(`.wrap`).css(`filter`, `brightness(0.7)`);
});

$(`.closeProfileBtn`).click(() => {
    $(`.profileContainer`).css(`display`, `none`);
    $(`.wrap`).css(`filter`, `brightness(1)`);
})

$(`.openChangeNameContainer`).click(() => {
    $(`.changeNameContainer`).css(`display`, `flex`);
    $(`.profileContainer`).css(`display`, `none`);
    $(`.wrap`).css(`filter`, `brightness(0.7)`);
})

$(`#cancelNameBtn`).click(() => {
    $(`.changeNameContainer`).css(`display`, `none`);
    $(`.profileContainer`).css(`display`, `flex`);
})

$(`.openChangeProfileImg`).click(() => {
    $(`.changeProfileImgContainer`).css(`display`, `flex`);
    $(`.profileContainer`).css(`display`, `none`);
    $(`.wrap`).css(`filter`, `brightness(0.7)`);
})

$(`.closeImgBtn`).click(() => {
    $(`.changeProfileImgContainer`).css(`display`, `none`);
    $(`.profileContainer`).css(`display`, `flex`);
})

$(`.selectFile`).click(() => {
    $(`#changeProfileImgInput`).click();
})

$(`.drag-and-drop`).on('dragover', (e) => {
    e.preventDefault();
});

$(`.drag-and-drop`).on('drop', (e) => {
    e.preventDefault();

    const file = e.originalEvent.dataTransfer.files[0];
    handleFile(file, userId);
});

$(`#changeProfileImgInput`).on('change', function () {
    const file = this.files[0];
    if (file) {
        console.log(file);
        handleFile(file, userId);
    }
});

function handleFile(file, userId) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    axios.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then(res => {
            console.log(res);
            showProfile(userId)
            $(`.changeProfileImgContainer`).css(`display`, `none`);
            $(`.profileContainer`).css(`display`, `flex`);
        })
        .catch((error) => {
            console.log(error);
        });
}

function showProfile(userId) {
    axios.get(`/allUsers`)
        .then((res) => {
            const user = res.data.find(el => el._id === userId);
            if (user) {
                const originalPath = user.path;
                const transformedPath = originalPath
                    .replace('public\\', './')
                    .replace(/\\/g, '/');
                $('#profileImg').css('background-image', `url(${transformedPath})`);
                $('#accountIcon').css('background-image', `url(${transformedPath})`);
                $('.profileName').text(user.login);
                $('.accountName').text(user.login);
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

showProfile(userId)

$(`#changeNameBtn`).click(() => {
    axios.put(`/chageName/${userId}`, {
        login: $('#changeNameInput').val()
    })
        .then((res) => {
            console.log(res);
            showProfile(userId)
            $(`.changeNameContainer`).css(`display`, `none`);
            $(`.profileContainer`).css(`display`, `flex`);
            $('#changeNameInput').val(``)
        })
        .catch((error) => {
            console.log(error);
        });
})

$(`.signOutBtn`).click(() => {
    $.removeCookie('userToken');
    window.location.href = '/';
})