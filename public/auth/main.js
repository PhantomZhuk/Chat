$(document).ready(() => {
    $('#openLoginBtn').on('click', () => {
        $('.loginForm').css('display', 'flex');
        $('.registerForm').css('display', 'none');
        $(`#openLoginBtn`).addClass('active');
        $(`#openLoginBtn`).removeClass('notActive');
        $(`#openRegisterBtn`).removeClass('active');
        $(`#openRegisterBtn`).addClass('notActive');
    })
    $('#openRegisterBtn').on('click', () => {
        $('.loginForm').css('display', 'none');
        $('.registerForm').css('display', 'flex');
        $(`#openLoginBtn`).removeClass('active');
        $(`#openLoginBtn`).addClass('notActive');
        $(`#openRegisterBtn`).addClass('active');
        $(`#openRegisterBtn`).removeClass('notActive');
    })

    let userToken = $.cookie('userToken') || '';

    $('#registerBtn').on('click', () => {
        const login = $('#registerInput').val();
        const password = $('#registerPasswordInput').val();

        const loginRegex = /[a-zA-Z]{3,}/;
        const passwordRegex = /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/;

        if (loginRegex.test(login)) {
            if (passwordRegex.test(password)) {
                axios.get('/allUsers')
                    .then((res) => {
                        const existingUser = res.data.find(el => el.login === login);

                        if (!existingUser) {
                            axios.post('/auth/createUser', { login, password })
                                .then(() => {
                                    console.log('User created');
                                    axios.get('/allUsers')
                                        .then((res) => {
                                            const newUser = res.data.find(el => el.login === login && el.password === password);

                                            if (newUser) {
                                                userToken = $.cookie('userToken', User._id, { path: '/' }, { expires: 7 });
                                                window.location.href = '/chats';
                                                $('#registerInput').val(``);
                                                $('#registerPasswordInput').val(``);
                                            } else {
                                                alert('User not found');
                                            }
                                        })
                                        .catch((error) => {
                                            console.error('Error getting users:', error);
                                        });
                                })
                                .catch((error) => {
                                    console.error('Error creating user:', error);
                                });
                        } else {
                            console.log('User already exists');
                        }
                    })
                    .catch((error) => {
                        console.error('Error getting users:', error);
                    });
            } else {
                console.log('Incorrect password');
            }
        } else {
            console.log('Incorrect login');
        }
    });

    $('#loginBtn').on('click', () => {
        axios.post(`/auth/login`, { login: $('#loginInput').val(), password: $('#passwordInput').val() })
            .then(() => {
                axios.get('/allUsers')
                    .then((res) => {
                        const login = $('#loginInput').val();
                        const password = $('#passwordInput').val();
                        const User = res.data.find(el => el.login === login && el.password === password);

                        if (User) {
                            userToken = $.cookie('userToken', User._id, { path: '/' }, { expires: 7 });
                            window.location.href = '/chats';
                            $('#loginInput').val(``);
                            $('#passwordInput').val(``);
                        } else {
                            console.log('User not found');
                        }
                    })
                    .catch((error) => {
                        console.error('Error getting users:', error);
                    });
            })
    })
})