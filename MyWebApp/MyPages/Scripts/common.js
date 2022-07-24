$(document).ready(function () {
    navbar();
});

function navbar() {
    if (sessionStorage.getItem('token')) {
        if (!sessionStorage.getItem('role')) {
            $.ajax({
                url: '/api/role/' + sessionStorage.getItem('token'),
                async: false,
                method: "GET",
                success: function (data, status) { sessionStorage.setItem('role', data) },
                error: (xhr) => { console.log(xhr.responseText); }
            });
        }
        var role = sessionStorage.getItem('role');
        if (role === "Owner") {
            $('nav').append(`<a class="nav-link active" href="registertrainer.html">Registruj trenera</a>
                             <a class="nav-link active" href="fitnesscenters.html">Fitnes centri</a>`);
        }
        else if (role === "Trainer") {
            $('nav').append('<a class="nav-link active" href="trainerhistory.html">Istorija</a>');
            $('nav').append('<a class="nav-link active" href="trainings.html">Treninzi</a>');
        }
        else {
            $('nav').append('<a class="nav-link active" href="history.html">Istorija</a>');
        }
        $('nav').append(`<a class="nav-link active" href="profile.html">Profil</a>
                         <a class="nav-link active" id="logout">Log out</a>`);
        logout();
    }
    else {
        $('nav').append(`<a class="nav-link active" href="register.html">Registracija</a>
                         <a class="nav-link active" href="login.html">Login</a>`);
    }

}

function logout() {
    $(document).on('click', "#logout", function () {
        id = sessionStorage.getItem('token');
        $.ajax({
            method: 'DELETE',
            url: '/api/logout/'+id,
            success: function (result) {
                console.log(result);
                window.location = "/MyPages/index.html";
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('username');
                sessionStorage.removeItem('role');
            },
            error: function (result) { console.log(result); }
        });
    });
}