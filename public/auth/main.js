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

        if (loginRegex.test(login)) {
            if (passwordRegex.test(password)) {
                if (emailRegex.test(email)) {
                    axios.get('/allUsers')
                        .then((res) => {
                            const existingUser = res.data.find(el => el.login === login);
                            $(`.notification`).css('display', 'none');
                            $(`.notification`).text(``);

                            if (!existingUser) {
                                axios.post(`/sendConfirmationEmail`, { email })
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
                        })
                        .catch((error) => {
                            console.error('Error getting users:', error);
                        });
                } else {
                    $(`.notificationEmail`).css('display', 'flex');
                    $(`.notificationEmail`).text(`Incorrect email`);
                    $(`.notificationPassword`).css('display', 'none');
                    $(`.notificationPassword`).text(``);
                    $(`.notificationLogin`).css('display', 'none');
                    $(`.notificationLogin`).text(``);
                }
            } else {
                $(`.notificationPassword`).css('display', 'flex');
                $(`.notificationPassword`).text(`Incorrect password it must contain at least 8 characters and at least 1 letter and 1 number`);
                $(`.notificationLogin`).css('display', 'none');
                $(`.notificationLogin`).text(``);
            }
        } else {
            $(`.notificationLogin`).css('display', 'flex');
            $(`.notificationLogin`).text(`Incorrect login, it must contain at least 3 characters`);
            $(`.notificationPassword`).css('display', 'none');
            $(`.notificationPassword`).text(``);
        }
    });

    $(`#verifyCodeBtn`).click(() => {
        const login = $('#registerInput').val();
        const email = $('#registerEmailInput').val();
        const password = $('#registerPasswordInput').val();
        const code = $('#confirmationCodeInput').val();
    
        axios.post('/auth/createUser', { login, password, email, code })
            .then((res) => {
                console.log('User created');
                const token = res.data.token;
                const refreshToken = res.data.refreshToken;
    
                axios.get('/allUsers')
                    .then((res) => {
                        const newUser = res.data.find(el => el.login === login && el.email === email);
                        console.log(newUser);
                        console.log(login, password, email);
    
                        if (newUser) {
                            localStorage.setItem('token', token, { path: '/' });
                            localStorage.setItem('refreshToken', refreshToken, { path: '/' });
                            $.cookie('userToken', newUser.id, { path: '/' });
                            window.location.href = '/chats';
                            $('#registerInput').val(``);
                            $('#registerPasswordInput').val(``);
                        } else {
                            showNotification(`User not found`);
                        }
                    })
                    .catch((error) => {
                        console.error('Error getting users:', error);
                    });
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
            const { token, refreshToken } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
    
            return axios.get('/allUsers');
        })
        .then((res) => {
            const login = $('#loginInput').val();
            const User = res.data.find(el => el.login === login);
    
            if (User) {
                $.cookie('userToken', User._id, { path: '/' });
                window.location.href = '/chats';
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
})