$(document).ready(() => {
    getReady();
    fillBlanks();
    change();
});

function getReady() {
    if (!sessionStorage.getItem('token'))
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
function change() {
    let token = sessionStorage.getItem('token');
    if (token) {
        $(document).on('click', '#submit', function () {
            if (checkAll(['name', 'lastname', 'username', 'email', 'password', 'gender', 'birthdate'])) {
                $.ajax({
                    url: '/api/user/' + token,
                    method: 'PUT',
                    datatype: JSON,
                    data: {
                        'name': $('#name').val(),
                        'lastname': $('#lastname').val(),
                        'username': $('#username').val(),
                        'email': $('#email').val(),
                        'password': $('#password').val(),
                        'gender': $('#gender').val(),
                        'birthdate': $('#birthdate').val()
                    },
                    success: (result) => { alert("Uspesno izmenjeni podaci"); },
                    error: (xhr, status, err) => { alert(xhr.responseJSON.Message); }
                });
            }
        });
    }
}
function fillBlanks() {
    let token = sessionStorage.getItem('token');
    if (token) {
        $.get('/api/user/' + token, function (data, status) {
            if (data) {
                $('#name').val(data.Name);
                $('#lastname').val(data.Lastname);
                $('#username').val(data.Username);
                $('#email').val(data.Email);
                $('#password').val(data.Password);
                if(data.Gender == 0)
                    $('#gender').val("Musko");
                else if (data.Gender == 1)
                    $('#gender').val("Zensko");
                else
                    $('#gender').val("Drugo");
                let date = data.BirthDate;
                const splited = date.split("/");
                $('#birthdate').val(`${splited[2]}-${splited[1]}-${splited[0]}`);
            }
        });
    }
}