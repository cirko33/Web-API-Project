$(document).ready(() => {
    getOne();
    signing('signin');
    signing('signout');
});

function signing(sign) {
    $(document).on('click', '.' + sign, function () {
        let id = $(this).attr('name');
        if (name != null) {
            $.post('/api/training' + sign, { 'token': sessionStorage.getItem('token'), 'id': id }, function (result) {
                let idCenter = window.location.href.split("?id=")[1];
                $.get(`/api/centertrainings/${idCenter}`, (data, status) => { printTrainings(data); });
            });
        }
    });
}

function getOne() {
    let id = window.location.href.split("?id=")[1];
    if (id == null)
        window.location = "/MyPages/index.html";
    console.log(`Get one center with id: ${id}`);
    $.get(`/api/fitnessCenter/${id}`, (data, status) => { printCenterDetailed(data); });

    console.log(`Get trainings for id: ${id}`);
    $.get(`/api/centertrainings/${id}`, (data, status) => { printTrainings(data); });

    console.log(`Get comments for id: ${id}`);
    $.get(`/api/comment/${id}`, (data, status) => { printComments(data); });

    console.log('Leave comment');
    leaveComment(id);
}

function leaveComment(id) {
    //Can leave a comment
    if (sessionStorage.getItem('token') && sessionStorage.getItem('role') == 'Visitor')
        $.get('/api/canleavecomment', { 'token': sessionStorage.getItem('token'), 'id': id }, function (data, status) {
            if (data) {
                let comment = `<label>Ostavite komentar:</label>
                               <input id="commentText"/>
                               <select id="commentMark">
                                   <option>1</option>
                                   <option>2</option>
                                   <option>3</option>
                                   <option>4</option>
                                   <option>5</option>
                               </select>
                               <input type="submit" class="btn btn-primary" id="submitComment" value="Ostavite komentar"/>`;
                $('#LeaveComment').html(comment);

                $(document).on('click', '#submitComment', function () {
                    let text = $("#commentText").val();
                    let mark = $("#commentMark").val();
                    if (text && mark) {
                        $.post('/api/comment/' + sessionStorage.getItem('token'), {
                            'fitnessCenter': id,
                            'text': text,
                            'mark': mark
                        }, function (result) {
                            alert("Uspesno ostavljen odgovor");
                        }).fail((xhr) => { alert(xhr.responseJSON.Message);});
                    }
                    else {
                        alert('Za komentar moraju biti popunjena sva polja');
                    }
                });
            }
        });
}

function printComments(data) {
    if (data && data.length != 0) {
        let table = `<table id='CommentImp'><tr><th colspan='4'>Komentari</th></tr>`;
        table += `<tr><th>Posetilac</th><th>Komentar</th><th>Ocena</th></tr>`;
        for (p in data) {
            table +=
                `<tr>
                    <td>${data[p].Visitor}</td>
                    <td>${data[p].Text}</td>
                    <td>${data[p].Mark}</td>
                </tr>`;
        }
        table += "</table><br/>";
        $('#Comments').html(table);
    }
    else {
        $('#Comments').html("<h3>Ne postoje komentari za ovaj fitnes centar</h3>");
    }
}

function printTrainings(data) {
    var table = "";
    if (data && data.length != 0) {
        let token = sessionStorage.getItem('token');
        var role = sessionStorage.getItem('role');
        table += `<h3>Treninzi</h3><table id='TrainingImp'>`;
        table += `<tr><th>Ime</th><th>Tip treninga</th><th>Trajanje treninga</th><th>Datum i vreme</th><th>Maksimalan broj posetilaca</th><th>Trenutni broj posetilaca</th>${token && role == "Visitor" ? "<th>Prijava</th>" : ""}</tr>`;
        let prijavljen = false;
        for (p in data) {
            table +=
                `<tr>
                    <td>${data[p].Name}</td>
                    <td>${data[p].TrainingType}</td>
                    <td>${data[p].TrainingDuration}</td>
                    <td>${data[p].DateTimeOfTraining}</td>
                    <td>${data[p].MaxNumberOfVisitors}</td>
                    <td>${data[p].Visitors.length}</td>`;
            if (token && role == "Visitor") {
                for (v in data[p].Visitors) {
                    if (data[p].Visitors[v] == sessionStorage.getItem('username')) {
                        prijavljen = true;
                        break;
                    }
                }
                if (data[p].MaxNumberOfVisitors <= data[p].Visitors.length) {
                    if (prijavljen)
                        table += `<td><button class='signout btn btn-primary' name='${data[p].Id}'>Odjavi se</button></td>`;
                }
                else
                    table += `<td><button class='${prijavljen ? 'signout' : 'signin'} btn btn-primary' name='${data[p].Id}'>${prijavljen ? 'Odjavi se' : 'Prijavi se'}</button></td>`;
            }
            table += `</tr>`;
        }
        table += "</table><br/>";
    }
    else {
        table = "<h3>Ne postoje treninzi za ovaj fitnes centar</h3>";
    }
    $('#Trainings').html(table);
}

function printCenterDetailed(data) {
    if (data) {
        var table = `<h3>Fitnes centar: ${data.Name}</h3><table id='OneFitnessCenterImp'>`;
        $.ajax({
            url: '/api/userinfo/' + data.Owner,
            method: 'GET',
            async: false,
            success: function (d, status) {
                console.log('Getting owner');
                if (d && d.length != 0)
                    table += `<tr>
                                <td><b>Vlasnik</b></td>
                                <td>${d.Name} ${d.Lastname}</td>
                              </tr>
                              <tr>
                                <td><b>Email vlasnika</b></td>
                                <td>${d.Email}</td>
                              </tr>`;
            }
        });
        table += `<tr>
                    <td><b>Ime</b></td>
                    <td>${data.Name}</td>
                  </tr>
                  <tr>
                    <td><b>Adresa</b></td>
                    <td>${data.Address}</td>
                  </tr>
                  <tr>
                    <td><b>Godina otvaranja</b></td>
                    <td>${data.YearOfOpening}</td>
                  </tr>
                  <tr>
                    <td><b>Mesecna clanarina</b></td>
                    <td>${data.MonthMembershipFee} RSD</td>
                  </tr>
                  <tr>
                    <td><b>Godisnja clanarina</b></td>
                    <td>${data.YearMembershipFee} RSD</td>
                  </tr>
                  <tr>
                    <td><b>Cena jednog treninga</b></td>
                    <td>${data.OneTrainingFee} RSD</td>
                  </tr>
                  <tr>
                    <td><b>Cena jednog grupnog treninga</b></td>
                    <td>${data.OneGroupTrainingFee} RSD</td>
                  </tr>
                  <tr>
                    <td><b>Cena jednog personalnog treninga</b></td>
                    <td>${data.OnePersonalTrainingFee} RSD</td>
                  </tr>
                </table>`;
        $('#FitCenterOne').html(table);
    }
    else {
        $('#FitCenterOne').html("<h1>Ne postoji takav centar</h1>");
    }
}

