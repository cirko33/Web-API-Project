$(document).ready(() => {
    getReady();
    loadHistory();
    search();
    viewInfo();
    sort();
});

function getReady() {
    if (sessionStorage.getItem('role') != 'Trainer')
        window.location = '/MyPages/index.html';
}

function minmax(data) {
    if (data && data.length != 0) {
        let o = new Date();
        let stringDate = `${o.getFullYear()}-${o.getMonth() + 1}-${o.getDay()} 23:59`;
        $("#dateMin").attr('min', data[0].FitnessCenter.YearOfOpening + '-01-01 00:00');
        $("#dateMax").attr('min', data[0].FitnessCenter.YearOfOpening + '-01-01 00:00');
    }
}

function search() {
    $('#find').click(function () {
        let name = $('#name').val();
        let trainingType = $('#trainingType').val();
        let dateMin = $('#dateMin').val();
        let dateMax = $('#dateMax').val();

        if (dateMin && dateMax) {
            if (dateMin > dateMax) {
                alert("Minimalni datum mora biti manji od maksimalnog");
                return;
            }
        }

        $.get('/api/trainerhistorysearch', {
            'token': sessionStorage.getItem('token'), "name": name,
            "trainingType": trainingType, "dateMin": dateMin, "dateMax": dateMax
        }, (data, status) => {
            if (data && data.length != 0)
                printHistory(data);
            else
                $("#History").html("<h3>Ne postoje treninzi sa takvim parametrima</h3>");
        });
    });
}

function loadHistory() {
    $.get('/api/history', { 'id': sessionStorage.getItem('token') }, (data, status) => {
        if (data && data.length != 0) {
            minmax(data);
            printHistory(data);
        }
        else {
            $("#History").html('<h3>Ne postoji istorija treninga za ovog trenera</h3>');
        }
    });
}

function sort() {
    $('#sort').click(function () {
        let sortBy = $('#sortBy').val();
        if (sortBy == "")
            alert("Morate uneti po cemu se sortira");

        let sortOrder = $('#sortOrder').val();
        if (sortOrder == "")
            alert("Morate uneti po kom redosledu sortirati");
        $.get('/api/sorthistory', { 'id': sessionStorage.getItem('token'), 'sortBy': sortBy, 'sortOrder': sortOrder }, (data, status) => {
            printHistory(data);
        });
    });
}

function printHistory(data) {
    if (data && data.length != 0) {
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
                    <td><button class="view btn btn-primary" name="${data[p].Id}">Posetioci</button></td>
             </tr>`;
        }
        table += "</table><br/>";
        $('#History').html(table);
    }
}

function viewInfo() {
    $(document).on('click', '.view', function () {
        let id = $(this).attr("name");
        if (id) {
            $.get('/api/trainingvisitors/' + id, function (data, status) {
                if (data && data.length != 0) {
                    let name = $("#name_" + id).val();
                    let table = `<h3>Posetioci za trening ${name}</h3>`
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
                                        <td>Korisnicko ime</td>
                                        <td>${data[v].Username}</td>
                                     </tr>
                                 </table>`;
                    }
                    $("#Visitors").html(table);
                }
                else {
                    $("#Visitors").html("<h3>Trening je zavrsen bez posetioca</h3>");
                }
            });
        }
    });
}
