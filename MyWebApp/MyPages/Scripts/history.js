$(document).ready(() => {
    getReady();
    loadHistory();
    search();
    sort();
});

function getReady() {
    if (sessionStorage.getItem('role') != 'Visitor')
        window.location = '/MyPages/index.html';
}

function search() {
    $('#find').click(function () {
        let name = $('#name').val();
        let trainingType = $('#trainingType').val();
        let centerName = $('#centerName').val();

        $.get('/api/historysearch', { 'id': sessionStorage.getItem('token'), "name": name, "trainingType": trainingType, "centerName": centerName}, (data, status) => {
            printHistory(data);
        });
    });
}

function loadHistory() {
    $.get('/api/history', { 'id': sessionStorage.getItem('token') }, (data, status) => {
        printHistory(data);
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
            if(data && data.length != 0)
                printHistory(data);
            else
                $("#History").html("<h3>Ne postoji istorija treninga </h3>")
        });
    });
}

function printHistory(data) {
    if (data != null) {
        console.log("Getting history for user");
        var table = `<h3>Istorija treninga</h3><table id='historyImp'>`;
        table += `<tr>
                    <th>Ime</th>
                    <th>Tip treninga</th>
                    <th>Fitnes centar</th>
                    <th>Trajanje treninga</th>
                    <th>Datum i vreme</th>
                  </tr>`;
        for (p in data) {
            table +=
                `<tr>
                      <td>${data[p].Name}</td>
                      <td>${data[p].TrainingType}</td>
                      <td>${data[p].FitnessCenter.Name}</td>
                      <td>${data[p].TrainingDuration}</td>
                      <td>${data[p].DateTimeOfTraining}</td>
                </tr>`;
        }
        table += "</table><br/>";
        $('#History').html(table);
    }
    else {
        $('#History').html("<h3>Ne postoji istorija za ovog korisnika</h3>");
    }
    
}