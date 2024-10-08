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
})