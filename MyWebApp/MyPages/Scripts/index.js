$(document).ready(() => {
    getCenters();
    getOneCenter();
    sortCenters();
    searchCenters();
});
function searchCenters() {
    $('#find').click(function () {
        let name = $('#name').val();
        if (name == null) name = "";
        let address = $('#address').val();
        if (address == null) address = "";
        let minYear = $('#minYear').val();
        let maxYear = $('#maxYear').val();

        if (minYear != null) {
            let minYearNum = parseInt(minYear);
            if (minYearNum == NaN) {
                alert("Za minimalnu godinu se mora uneti broj");
                return;
            }
            else if (minYearNum < 0) {
                alert("Minimalna godina mora biti pozivitan broj");
                return;
            }
        }

        if (maxYear != null) {
            let maxYearNum = parseInt(maxYear);
            if (maxYearNum == NaN) {
                alert("Za maksimalnu godinu se mora uneti broj");
                return;
            }
            else if (maxYearNum < 0) {
                alert("Maksimalna godina mora biti pozivitan broj");
                return;
            }
        }

        $.get('/api/centersearch', { "name": name, "address": address, "minYear": minYear, "maxYear": maxYear }, (data, status) => {
            printCenters(data);
        });
    });
}

function sortCenters() {
    $('#sort').click(function () {
        let sortBy = $('#sortBy').val();
        if (sortBy == "")
            alert("Mora se po necemu sortirati");

        let sortOrder = $('#sortOrder').val();
        if (sortOrder == "")
            alert("Mora se po nekom redosledu sortirati");
        $.get('/api/sortcenters', { 'sortBy': sortBy, 'sortOrder': sortOrder }, (data, status) => {
            printCenters(data);
        });
    });
}

function getCenters() {
    $.ajax({
        url: '/api/fitnessCenter', 
        method: 'GET',
        async: false,
        success: (data, status) => { printCenters(data); },
        error: (xhr) => { alert(xhr.responseText); }
    });
}

function getOneCenter() {
    $(document).on('click', '.centerDetailsBtn', function () {
        let id = $(this).attr('name');
        if (id)  window.location = '/MyPages/details.html?id=' + id;
    });

}

function printCenters(data) {
    console.log("Print fitness centers");
    if (data && data.length != 0) {
        let table = `<h3>Fitnes centri</h3><table id='FitCenterTableImp'>
            <tr>
                <th>Ime</th>
                <th>Adresa</th
                ><th>Godina otvaranja</th>
                <th>Detaljnije</th>
            </tr>`;
        for (p in data) {
            table +=
                `<tr>
                    <td>${data[p].Name}</td>
                    <td>${data[p].Address}</td>
                    <td>${data[p].YearOfOpening}</td>
                    <td><button class="centerDetailsBtn btn btn-primary" name='${data[p].Id}'>Detalji</button></td>
                 </tr>`
        }
        table += "</table><br/>";
        $('#FitCenterTable').html(table);
    }
    else {
        $('#FitCenterTable').html('<h3>Ne postoje raspolozivi fitnes centri</h3>');
    }
}