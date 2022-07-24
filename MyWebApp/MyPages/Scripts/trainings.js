$(document).ready(() => {
    getReady();
    getTrainings();
    viewInfo();
    updateInfo();
    addTraining();
    deleteTraining();
});

function getReady() {
    if (sessionStorage.getItem('role') != 'Trainer')
        window.location = '/MyPages/index.html';
    let d = new Date();
    let year = d.getFullYear();
    let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
    let month = d.getMonth() < 9 ? "0"+d.getMonth()+1:d.getMonth()+1;
    $("#date").attr("min", `${year}-${month}-${day}T00:00`);
}

function getTrainings() {
    let token = sessionStorage.getItem('token');
    if (token) {
        $.get('/api/trainertrainings/' + token, function (data, status) {
            if (data && data.length != 0) 
                printTrainings(data);
            else 
                $("#trainings").html('<h3>Trener nema nijedan trening</h3>');
        });
    }
}

function printTrainings(data) {
    let table = `<h3>Treninzi</h3><table>`;
    table += `<tr>
                 <th>Ime</th>
                 <th>Tip treninga</th>
                 <th>Trajanje treninga</th>
                 <th>Datum i vreme</th>
                 <th>Maksimalan broj posetilaca</th>
                 <th>Trenutni broj posetilaca</th>
                 <th>Opcije</th>
              </tr>`;
    for (p in data) {
        table +=
            `<tr>
                    <td id="${"name_" + data[p].Id}">${data[p].Name}</td>
                    <td>${data[p].TrainingType}</td>
                    <td>${data[p].TrainingDuration}</td>
                    <td>${data[p].DateTimeOfTraining}</td>
                    <td>${data[p].MaxNumberOfVisitors}</td>
                    <td>${data[p].Visitors.length}</td>
                    <td>
                        <button class="delete btn btn-primary" name="${data[p].Id}" ${data[p].Visitors.length > 0 ? "disabled" : ""}>Obrisi</button>
                        <button class="update btn btn-primary" name="${data[p].Id}">Izmeni</button>
                        <button class="view btn btn-primary" name="${data[p].Id}">Posetioci</button>
                    </td>
             </tr>`;
    }
    table += "</table><br/>";
    $("#trainings").html(table);
}

function addTraining() {
    $("#submit").click(function () {
        if (checkAll(["name", "trainingType", "duration", "maxVisitors", "date"])) {
            data = {
                "name": $("#name").val(),
                "trainingType": $("#trainingType").val(),
                "duration": $("#duration").val(),
                "maxVisitors": $("#maxVisitors").val(),
                "date": $("#date").val()
            };
            if (parseInt(data.duration) <= 0 || parseInt(data.maxVisitors <= 0)) {
                alert("Brojevi moraju biti celi pozitivni");
                return;
            }
            $.post('/api/training/'+sessionStorage.getItem('token'), data, function (result) {
                console.log("Successfull add of training"); getTrainings();
            }).fail((xhr) => { alert(xhr.responseJSON.Message);  });
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

function viewInfo() {
    $(document).on('click', '.view', function () {
        let id = $(this).attr("name");
        if (id) {
            $.get('/api/trainingvisitors/' + id, function (data, status) {
                if (data && data.length != 0) {
                    let name = $("#name_" + id).val();
                    let table = `<h3>Posetioci za trening</h3>`
                    for (v in data) {
                        table += `<table>
                                     <tr>
                                        <td>Ime</td>
                                        <td>${data[v].Name}</td>
                                     </tr>
                                     <tr>
                                        <td>Prezime</td>
                                        <td>${data[v].Lastname}</td>
                                     </tr>
                                     <tr>
                                        <td>Username</td>
                                        <td>${data[v].Username}</td>
                                     </tr>
                                 </table>`;
                    }
                    $("#viewchange").html(table);
                }
                else {
                    $("#viewchange").html("<h3>Nema posetioca</h3>");
                }
            });
        }
    });
}

function updateInfo() {
    $(document).on('click', '.update', function () {
        let id = $(this).attr("name");
        $.get('/api/training/' + id, function (data, status) {
            if (data) {
                let text = `
                    <h3>Izmeni trening</h3>
                    <label>Naziv:</label>
                    <input id="updateName" value="${data.Name}" class="form-control"/>
                    <label>Tip treninga:</label>
                    <select id="updateTrainingType" class="form-select">
                        <option>YOGA</option>
                        <option>LES MILLS TONE</option>
                        <option>BODYATTACK</option>
                        <option>LES MILLS CORE</option>
                    </select>
                    <label>Trajanje (u minutima):</label>
                    <input id="updateDuration" type="number" value="${data.TrainingDuration}" class="form-control"/>
                    <label>Maksimalno posetilaca:</label>
                    <input id="updateMaxVisitors" type="number" value="${data.MaxNumberOfVisitors}" class="form-control"/>
                    <label>Datum i vreme:</label>
                    <input type="datetime-local" id="updateDate" />
                    <br /><br/>
                    <button id="submitUpdate" class="btn btn-primary">Azuriraj trening</button>
                    <br />`

                $("#viewchange").html(text);

                let type = "";
                if (data.TrainingType.includes("LES"))
                    type = "LES MILLS" + data.TrainingType.substr(7);
                else
                    type = data.TrainingType;
                $("#updateTrainingType").val(type);

                let temp = data.DateTimeOfTraining.split(' ');
                let splited = temp[0].split('/');
                $("#updateDate").val(`${splited[2]}-${splited[1]}-${splited[0]} ${temp[1]}`);
            }
        });

        $(document).on('click', '#submitUpdate', function () {
            if (checkAll(["updateName", "updateTrainingType", "updateDuration", "updateMaxVisitors", "updateDate"])) {
                let d = {
                    "name": $("#updateName").val(),
                    "trainingType": $("#updateTrainingType").val(),
                    "duration": $("#updateDuration").val(),
                    "maxVisitors": $("#updateMaxVisitors").val(),
                    "date": $("#updateDate").val()
                };
                if (parseInt(d.duration) <= 0 || parseInt(d.maxVisitors <= 0)) {
                    alert("Brojevi moraju biti celi pozitivni");
                    return;
                }
                $.ajax({
                    url: '/api/training/' + id,
                    method: 'PUT',
                    data: d,
                    async: false,
                    dataType: 'JSON',
                    success: (result) => { alert("Uspesna izmena korisnika"); },
                    error: (xhr) => { alert(xhr.responseJSON.Message); }
                });
                getTrainings();
            }
        });
    });
}

function deleteTraining() {
    $(document).on('click', '.delete', function () {
        let id = $(this).attr("name");
        if (id) {
            $.ajax({
                url: '/api/training/' + id,
                method: 'DELETE',
                async: false,
                success: () => { console.log('deleted') }
            });
            getTrainings();
        }
    });
}