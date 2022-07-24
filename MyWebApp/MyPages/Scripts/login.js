
$(document).ready(function () {
    getReady();
    login();
});

function getReady() {
    if (sessionStorage.getItem('token'))
        window.location = '/MyPages/index.html';
}

function check(id) {
    let prop = $('#' + id).val();
    if (!prop || prop.trim() === '') {
        $('#' + id).css('border-color', 'red');
        return false;
    }
    $('#' + id).css('border-color', 'black');
    return true;
}

function login() {
    $('#loginBtn').click(function () {
        if (!check('username') || !check('password')) {
            alert('Sva polja moraju biti popunjena!');
            return;
        }
        
        data = { 'username': $('#username').val(), 'password': $('#password').val()};
        $.post('/api/login', data, function (result) {
            console.log(result);
            sessionStorage.setItem('token', result);
            sessionStorage.setItem('username', $('#username').val());
            window.location = '/MyPages/index.html';
        }).fail(function (xhr, status, err) { alert("Lose uneti podaci"); });
    });
}