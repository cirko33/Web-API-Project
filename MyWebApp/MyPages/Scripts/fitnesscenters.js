$(document).ready(() => {
    getReady();
    getCenters();
    updateInfo();
    addFitnessCenter();
    deleteFitnessCenter();
    trainerInfo();
    getComments();
    commentStatus();
});

let lastCom = -1;

function getReady() {
    if (sessionStorage.getItem('role') != 'Owner')
        window.location = '/MyPages/index.html';
}

function getCenters() {
    let token = sessionStorage.getItem('token');
    if (token) {
        $.get('/api/ownercenters/' + token, function (data, status) {
            if (data && data.length != 0)
                printFitnessCenters(data);
            else
                $("#centers").html('<h3>Ne posedujete nijedan fitnes centar</h3>');
        });
    }
}

function printFitnessCenters(data) {
    let table = `<h3>Fitnes centri</h3><table></tr>`;
    table += `<tr>
                <th>Ime</th>
                <th>Adresa</th>
                <th>Godina otvaranja</th>
                <th>Cena mesecne clanarine</th>
                <th>Cena godisnje clanarine</th>
                <th>Cena jednog treninga</th>
                <th>Cena jednog grupnog treninga</th>
                <th>Cena jednog personalnog treninga</th>
              </tr>`;
    for (p in data) {
        let canDelete = false;
        $.ajax({
            url: '/api/candeletefc/' + data[p].Id,
            method: 'GET',
            async: false,
            success: (d, status) => { if (d != null) canDelete = d;}
        });
        table +=
            `<tr>
                <td>${data[p].Name}</td>
                <td>${data[p].Address}</td>
                <td>${data[p].YearOfOpening}</td>
                <td>${data[p].MonthMembershipFee}</td>
                <td>${data[p].YearMembershipFee}</td>
                <td>${data[p].OneTrainingFee}</td>
                <td>${data[p].OneGroupTrainingFee}</td>
                <td>${data[p].OnePersonalTrainingFee}</td>
                <td><button class="update btn btn-primary" name="${data[p].Id}">Izmeni</button></td>
                <td><button class="delete btn btn-primary" name="${data[p].Id}" ${canDelete ? "" : "disabled"}>Obrisi</button></td>
                <td><button class="trainers btn btn-primary" name="${data[p].Id}">Treneri</button></td>
                <td><button class="comments btn btn-primary" name="${data[p].Id}">Komentari</button></td>
            </tr>`;
    }
    table += "</table><br/>";
    $("#centers").html(table);
}

function addFitnessCenter() {
    $("#submit").click(function () {
        if (checkAll(["name", "street", "number", "city", "postNumber", "yearOfOpening",
            "monthMembershipFee", "yearMembershipFee", "oneTrainingFee", "oneGroupTrainingFee", "onePersonalTrainingFee"])) {
            data = {
                "name": $("#name").val(),
                "address": $("#street").val() + " " + $("#number").val() + ", " + $("#city").val() + ", " + $("#postNumber").val(),
                "yearOfOpening": $("#yearOfOpening").val(),
                "monthMembershipFee": $("#monthMembershipFee").val(),
                "yearMembershipFee": $("#yearMembershipFee").val(),
                "oneTrainingFee": $("#oneTrainingFee").val(),
                "oneGroupTrainingFee": $("#oneGroupTrainingFee").val(),
                "onePersonalTrainingFee": $("#onePersonalTrainingFee").val()
            };

            let good = true;
            if (parseFloat(data.monthMembershipFee) <= 0 || parseFloat(data.yearMembershipFee) <= 0 || parseFloat(data.oneTrainingFee) <= 0
                || parseFloat(data.oneGroupTrainingFee) <= 0 || parseFloat(data.onePersonalTrainingFee) <= 0) {
                alert("Sva polja koja sadrze pretplate moraju biti veca od 0");
                good = false;
            }
            if (parseInt($("#postNumber").val()) <= 0) {
                alert("Postanski broj mora biti veci od 0");
                good = false;
            }
            if (!good) return;

            $.post('/api/fitnesscenter/' + sessionStorage.getItem('token'), data, function (result) {
                alert('Uspesno dodat fitnes centar ' + $("#name").val()); getCenters();
            }).fail((xhr) => { alert(xhr.responseJSON.Message); });
        }
    });
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

function updateInfo() {
    $(document).on('click', '.update', function () {
        let id = $(this).attr("name");
        $.get('/api/fitnesscenter/' + id, function (data, status) {
            if (data) {
                let splited = data.Address.split(', ');
                let text = `
                            <div><h3>Izmena podataka</h3></div>
                            <div style="display:flex">
                                <div class="form-group my-group">
                                <label>Naziv:</label>
                                <input id="updateName" value="${data.Name}" class="form-control"/>
                                
                                <label>Adresa:</label>
                                <input id="updateStreet" placeholder="Ulica" value="${splited[0].split(' ')[0]}" class="form-control" style="margin-bottom:5px;"/>
                                <input id="updateNumber" placeholder="Broj" value="${splited[0].split(' ')[1]}" class="form-control" style="margin-bottom:5px;"/>
                                <input id="updateCity" placeholder="Mesto/Grad" value="${splited[1]}" class="form-control" style="margin-bottom:5px;"/>
                                <input id="updatePostNumber" placeholder="Postanski broj" value="${splited[2]}" class="form-control" style="margin-bottom:5px;"/>
                                </div>
                                <div class="form-group my-group">   
                                <label>Godina otvaranja fitnes centra:</label>
                                <input id="updateYearOfOpening" type="number" value="${data.YearOfOpening}" class="form-control"/>

                                <label>Cena mesecne clanarine:</label>
                                <input id="updateMonthMembershipFee" type="number" value="${data.MonthMembershipFee}" class="form-control"/>

                                <label>Cena godisnje clanarine:</label>
                                <input id="updateYearMembershipFee" type="number" value="${data.YearMembershipFee}" class="form-control"/>
                                </div>
                                <div class="form-group my-group">
                                <label>Cena jednog treninga:</label>
                                <input id="updateOneTrainingFee" type="number" value="${data.OneTrainingFee}" class="form-control"/>

                                <label>Cena jednog grupnog treninga:</label>
                                <input id="updateOneGroupTrainingFee" type="number" value="${data.OneGroupTrainingFee}" class="form-control"/>

                                <label>Cena jednog treninga sa personalnim trenerom:</label>
                                <input id="updateOnePersonalTrainingFee" type="number" value="${data.OnePersonalTrainingFee}" class="form-control"/>
                                </div>
                            </div>
                            <div><button id="updateSubmit" class="btn btn-primary">Izmeni fitnes centar</button></div>
                            `

                $("#updateView").html(text);
            }
        });

        $(document).on('click', '#updateSubmit', function () {
            if (checkAll(["updateName", "updateStreet", "updateNumber", "updateCity", "updatePostNumber", "updateYearOfOpening",
                "updateMonthMembershipFee", "updateYearMembershipFee", "updateOneTrainingFee",
                "updateOneGroupTrainingFee", "updateOnePersonalTrainingFee"])) {

                d = {
                    "Id": id,
                    "Name": $("#updateName").val(),
                    "Address": $("#updateStreet").val() + " " + $("#updateNumber").val() + ", " + $("#updateCity").val() + ", " + $("#updatePostNumber").val(),
                    "YearOfOpening": $("#updateYearOfOpening").val(),
                    "MonthMembershipFee": $("#updateMonthMembershipFee").val(),
                    "YearMembershipFee": $("#updateYearMembershipFee").val(),
                    "OneTrainingFee": $("#updateOneTrainingFee").val(),
                    "OneGroupTrainingFee": $("#updateOneGroupTrainingFee").val(),
                    "OnePersonalTrainingFee": $("#updateOnePersonalTrainingFee").val()
                };
                let good = true;
                if (parseFloat(data.MonthMembershipFee) <= 0 || parseFloat(data.YearMembershipFee) <= 0 || parseFloat(data.OneTrainingFee) <= 0
                    || parseFloat(data.OneGroupTrainingFee) <= 0 || parseFloat(data.OnePersonalTrainingFee) <= 0) {
                    alert("Sva polja koja sadrze pretplate moraju biti veca od 0");
                    good = false;
                }
                if (parseInt($("#updatePostNumber").val()) <= 0) {
                    alert("Postanski broj mora biti veci od 0");
                    good = false;
                }
                if (!good) return;

                $.ajax({
                    url: '/api/fitnesscenter/' + sessionStorage.getItem('token'),
                    method: 'PUT',
                    data: d,
                    async: false,
                    dataType: 'JSON',
                    success: (result) => { alert('Uspesna izmena'); },
                    error: (xhr) => { alert(xhr.responseJSON.Message); }
                });
                getCenters();
            }
        });
    });
}

function deleteFitnessCenter() {
    $(document).on('click', '.delete', function () {
        let id = $(this).attr("name");
        if (id) {
            $.ajax({
                url: `/api/fitnesscenter/${sessionStorage.getItem('token')}_${id}`,
                method: 'DELETE',
                async: false,
                success: () => { alert("Uspesno obrisano"); }
            });
            getCenters();
            $('#updateView').html('');
        }
    });
}

function trainerInfo() {
    $(document).on('click', '.trainers', function () {
        let id = $(this).attr('name');
        getTrainers(id);
    });

    $(document).on('click', '.block', function () {
        let id = $(this).attr('name');
        $.post('/api/blocktrainer/' + id, { 'token': sessionStorage.getItem('token') },
            function (result) {
                alert('Uspesno blokiran trener: ' + id);
                getTrainers(id);
            }).fail((xhr, status, err) => { alert(xhr.responseJSON.Message); });
    });
}

function getTrainers(id) {
    $.get('/api/centertrainers/' + id, function (data, status) {
        if (data && data.length != 0) {
            let table = `<h2>Treneri</h2><table>
                <tr>
                    <th>Ime</th>
                    <th>Prezime</th>
                    <th>Korisnicko ime</th>
                    <th>Email</th>
                    <th>Pol</th>
                    <th>Datum rodjenja</th>
                </tr>`;
            for (i in data) {
                table += `
                <tr>
                    <td>${data[i].Name}</td>
                    <td>${data[i].Lastname}</td>
                    <td>${data[i].Username}</td>
                    <td>${data[i].Email}</td>
                    <td>${data[i].Gender}</td>
                    <td>${data[i].BirthDate}</td>
                    <td><button class="block btn btn-primary" name="${data[i].Username}">Blokiraj</button></td>
                </tr>`;
            }
            table += '</table>';
            $('#updateView').html(table);
        }
        else {
            $('#updateView').html("<h2>Ne postoje treneri za ovaj fitnes centar</h2>")
        }
    });
}

function getComments() {
    $(document).on('click', '.comments', function () {
        let id = $(this).attr("name");
        printComments(id);
        lastCom = id;
    });
}

function printComments(id) {
    $.get('/api/allcomments/' + id, function (data, status) {
        if (data && data.length != 0) {
            let table = `<h3>Komentari</h3><table>
                <tr>
                    <th>Korisnik</th>
                    <th>Tekst</th>
                    <th>Ocena</th>
                    <th>Status</th>
                </tr>`
            for (i in data) {
                table += `<tr>
                            <td>${data[i].Visitor}</td>
                            <td>${data[i].Text}</td>
                            <td>${data[i].Mark}</td>
                            <td>${(data[i].Status == 0 ? "CEKA" : (data[i].Status == 1 ? "ODBIJEN" : "POTVRDJEN"))}</td>`
                if (data[i].Status == 0) {
                    table += `<td><button class="accept btn btn-primary" name="${data[i].Id}">Potvrdi</button></td>
                              <td><button class="decline btn btn-primary" name="${data[i].Id}">Odbij</button></td>`;
                }
            }
            table += `</tr></table>`;
            $('#updateView').html(table);
        }
        else {
            $('#updateView').html('<h3>Ne postoje komentari</h3>');
        }
    });
}

function commentStatus() {
    $(document).on('click', ".accept", function () {
        let id = $(this).attr("name");
        $.ajax({
            url: '/api/comment/' + sessionStorage.getItem('token'),
            method: 'PUT',
            async: false,
            data: { 'id': id, 'status': 'ACCEPTED' },
            dataType: 'JSON'
        });
        printComments(lastCom);
    });

    $(document).on('click', ".decline", function () {
        let id = $(this).attr("name");
        $.ajax({
            url: '/api/comment/' + sessionStorage.getItem('token'),
            method: 'PUT',
            async: false,
            data: { 'id': id, 'status': 'DECLINED' },
            dataType: 'JSON'
        });
        printComments(lastCom);
    });
}