$('#openLoginBtn').on('click', () => {
    $('.loginForm').css('display', 'flex');
    $('.registerForm').css('display', 'none');
    $('.authForm').css('height', '400px');
    $(`#openLoginBtn`).addClass('active');
    $(`#openLoginBtn`).removeClass('notActive');
    $(`#openRegisterBtn`).removeClass('active');
    $(`#openRegisterBtn`).addClass('notActive');
    $(`.notification`).text(``);
})

$('#openRegisterBtn').on('click', () => {
    $('.loginForm').css('display', 'none');
    $('.registerForm').css('display', 'flex');
    $('.authForm').css('height', '500px');
    $(`#openLoginBtn`).removeClass('active');
    $(`#openLoginBtn`).addClass('notActive');
    $(`#openRegisterBtn`).addClass('active');
    $(`#openRegisterBtn`).removeClass('notActive');
    $(`.notification`).text(``);
})

$('#registerBtn').on('click', () => {
    const login = $('#registerInput').val();
    const email = $('#registerEmailInput').val();
    const password = $('#registerPasswordInput').val();

    axios.post(`/users/create`, { login, password, email })
        .then((res) => {
            $(`.confirmationCodeContainer`).css('display', 'flex');
            $(`.authForm`).css('display', 'none');
        })
        .catch((error) => {
            console.error('Error sending email:', error);
        });
});

$(`#verifyCodeBtn`).click(() => {
    const code = $('#confirmationCodeInput').val();
    const email = $('#registerEmailInput').val();

    axios.post('/users/confirmVerificationCode', { email, code })
        .then((res) => {
            window.location.href = '/';
            $('#registerInput').val(``);
            $('#registerPasswordInput').val(``);
        })
        .catch((error) => {
            if (error.response && error.response.data) {
                showNotification(error.response.data.message || 'Error creating user');
            } else {
                console.error('Error creating user:', error);
                showNotification('Error creating user');
            }
        });
})

$('#loginBtn').on('click', () => {
    axios.post(`/users/login`, {
        login: $('#loginInput').val(),
        password: $('#passwordInput').val()
    })
        .then((res) => {
            return axios.get('/users/all');
        })
        .then((res) => {
            const login = $('#loginInput').val();
            const User = res.data.find(el => el.login === login);

            if (User) {
                $.cookie('userToken', User._id, { path: '/' });
                window.location.href = '/';
                $('#loginInput').val('');
                $('#passwordInput').val('');
            } else {
                showNotification(`User not found`);
            }
        })
        .catch((error) => {
            console.error('Error during login or fetching users:', error);
            showNotification(`Login failed: ${error.response ? error.response.data : 'Unknown error'}`);
        });
});

function showNotification(message) {
    $(`.notificationContainer`).css('display', 'flex');
    $(`.notificationText`).text(message);
    setTimeout(() => {
        $(`.notificationContainer`).css('display', 'none');
        $(`.notificationText`).text(``);
    }, 3000);
}