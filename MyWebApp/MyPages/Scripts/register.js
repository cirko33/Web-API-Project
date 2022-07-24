
$(document).ready(function () {
    getReady();
    register();
});

function getReady() {
    if (sessionStorage.getItem('token'))
        window.location = '/MyPages/index.html';

    $("#birthdate").attr("max", `${new Date().getFullYear() - 13}-12-31`)
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

function checkAll(list) {
    let goodInput = true;
    for (i in list)
        if (!check(list[i]))
            goodInput = false;

    if (!goodInput) alert("Sva polja moraju biti pravilno popunjena!");
    return goodInput;
}

function register() {
    $(document).on('click', '#register', function () {
        if (checkAll(['name', 'lastname', 'username', 'email', 'password', 'gender', 'birthdate'])) {
            data = {
                'name': $('#name').val(),
                'lastname': $('#lastname').val(),
                'username': $('#username').val(),
                'email': $('#email').val(),
                'password': $('#password').val(),
                'gender': $('#gender').val(),
                'birthdate': $('#birthdate').val(),
            };

            if (!data.email.match('.+@.+\..*')) {
                alert("Nevalidno unesena email adresa");
                return;
            }
            $.post('/api/user', data, function (result) {
                alert("Uspesno registrovanje korisnika " + data.username);
                window.location = '/MyPages/login.html';
            }).fail(function (xhr, status, err) {
                alert(xhr.responseJSON.Message);
            });
        }
    });
}

