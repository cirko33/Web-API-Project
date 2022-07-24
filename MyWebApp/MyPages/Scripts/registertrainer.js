
$(document).ready(function () {
    getReady();
    register();
});

function getReady() {
    if (sessionStorage.getItem('role') != "Owner")
        window.location = '/MyPages/index.html';
    $.ajax({
        url: '/api/ownercenters/' + sessionStorage.getItem('token'),
        method: 'GET',
        async: false,
        success: (data, status) => {
            if (data && data.length != 0) {
                var opt = "";
                for (i in data) {
                    opt += `<option value=${data[i].Id}>${data[i].Name}</option>`;
                }
                $('#fc').html(opt);
            }
        }
    });


    $("#birthdate").attr("max", `${new Date().getFullYear()-16}-12-31`)
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
        if (checkAll(['name', 'lastname', 'username', 'email', 'password', 'gender', 'birthdate', 'fc'])) {
            data = {
                'name': $('#name').val(),
                'lastname': $('#lastname').val(),
                'username': $('#username').val(),
                'email': $('#email').val(),
                'password': $('#password').val(),
                'gender': $('#gender').val(),
                'birthdate': $('#birthdate').val(),
                'fc': $('#fc').val()
            };
            if (!data.email.match('.+@.+\..*')) {
                alert("Nevalidno unesena email adresa");
                return;
            }

            $.post('/api/trainerregistration/'+sessionStorage.getItem('token'), data, function (result) {
                alert("Uspesno registrovanje korisnika " + data.username);
            }).fail(function (xhr, status, err) {
                alert(xhr.responseJSON.Message);
            });
        }
    });
}

