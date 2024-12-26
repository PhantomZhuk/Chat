$(document).ready(() => {
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

        const loginRegex = /[a-zA-Z]{3,}/;
        const passwordRegex = /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (loginRegex.test(login) && passwordRegex.test(password) && emailRegex.test(email)) {
            axios.get(`/auth/allUsers`)
                .then((res) => {
                    const existingUser = res.data.find(el => el.login === login);
                    $(`.notification`).css('display', 'none');
                    $(`.notification`).text(``);

                    if (!existingUser) {
                        axios.post(`/auth/sendConfirmationEmail`, { email })
                            .then((res) => {
                                $(`.confirmationCodeContainer`).css('display', 'flex');
                                $(`.authForm`).css('display', 'none');
                            })
                            .catch((error) => {
                                console.error('Error sending email:', error);
                            });
                    } else {
                        showNotification(`User already exists`);
                    }
                }).catch((error) => {
                    console.error('Error getting users:', error);
                });
        } else {
            if (!loginRegex.test(login)) {
                $(`.notification`).css('display', 'flex');
                $(`.notification`).text(`Incorrect login`);
            }
            if (!passwordRegex.test(password)) {
                $(`.notification`).css('display', 'flex');
                $(`.notification`).text(`Incorrect password`);
            }
            if (!emailRegex.test(email)) {
                $(`.notification`).css('display', 'flex');
                $(`.notification`).text(`Incorrect email`);
            }
        }
    });

    $(`#verifyCodeBtn`).click(() => {
        const login = $('#registerInput').val();
        const email = $('#registerEmailInput').val();
        const password = $('#registerPasswordInput').val();
        const code = $('#confirmationCodeInput').val();

        axios.post('/auth/register', { login, password, email, code })
            .then((res) => {
                window.location.href = '/';
                $('#registerInput').val(``);
                $('#registerPasswordInput').val(``);
            })
    })
        .catch((error) => {
            if (error.response && error.response.data) {
                showNotification(error.response.data.message || 'Error creating user');
            } else {
                console.error('Error creating user:', error);
                showNotification('Error creating user');
            }
        });
});

$('#loginBtn').on('click', () => {
    axios.post(`/auth/login`, {
        login: $('#loginInput').val(),
        password: $('#passwordInput').val()
    })
        .then((res) => {
            return axios.get('/auth/allUsers');
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