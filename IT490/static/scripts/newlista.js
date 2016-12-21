$(document).ready(function () {
    var table = $('#prijava').DataTable({
        "oLanguage": {
            "sLengthMenu": "Приказ _MENU_ записа по страни",
            "sZeroRecords": "Неманичега за приказ",
            "sInfo": "Приказано _START_ do _END_ од _TOTAL_ записа",
            "sInfoEmpty": "Приказано 0 do 0 od 0 записа",
            "sInfoFiltered": "(филтрирано _MAX_ укупно записа)",
            "oPaginate": {
                "sFirst": "Прва",
                "sNext": "Следећа",
                "sPrevious": "Претходна"
            }
        },
        destroy: true,
        columnDefs: [{
            orderable: true,
            className: 'select-checkbox',
            targets: 0
        }],
        select: {
            style: 'os',
            selector: 'td:first-child'
        },
        order: [[1, 'asc']]
    });
    $('#svipredmeti tbody').on('click', 'tr', function () {
        $(this).toggleClass('selected');
    });
    $('#ok').click(function () {
        var dataSet = table.rows('.selected').data();
        var izabraniTable = $('#izabrani').DataTable({
            "oLanguage": {
                "sLengthMenu": "Prikaz _MENU_ zapisa po strani",
                "sZeroRecords": "Nema nicega",
                "sInfo": "Prikazano _START_ do _END_ od _TOTAL_ zapisa",
                "sInfoEmpty": "Prikazano 0 do 0 od 0 zapisa",
                "sInfoFiltered": "(filtrirano _MAX_ ukupno zapisa)",
                "oPaginate": {
                    "sFirst": "Prva Strana",
                    "sNext": "Sledeća",
                    "sPrevious": "Prethodna"
                }
            },
            data: dataSet,
            columns: [
                { title: "ISUM-ID" },
                { title: "Sifra Predmeta" },
                { title: "Puno ime" },
                { title: "Ekvivalent" }
            ],
            destroy: true
        });


        var TableData;
        TableData = storeTblValues()
        TableData = JSON.stringify(TableData);
        function storeTblValues() {
            var TableData = new Array();
            $('#izabrani tr').each(function (row, tr) {
                TableData[row] = {
                    'id': $(tr).find('td:eq(0)').text()
                    , 'sifra': $(tr).find('td:eq(1)').text()
                    , 'punoIme': $(tr).find('td:eq(2)').text()
                    , 'ekvivalent': $(tr).find('td:eq(3)').text()
                }
            });
            TableData.shift();  // first row will be empty - so remove
            //console.log(TableData)
            return TableData;
        }
        $.ajax({
            data: TableData,
            contentType: 'application/json; charset=utf-8',
            //"dataSrc": "tableData",
            dataType: 'json',
            type: 'POST',
            url: "/_proccess_table"
        })
         .done(function (data) {
             $('#errorAlert').text(JSON.stringify(data)).show();
             // EXTRACT VALUE FOR HTML HEADER. 
             // ('Book ID', 'Book Name', 'Category' and 'Price')
             var col = [];
             var data = JSON.parse(JSON.stringify(data, ['id', 'sifra', 'punoIme', 'ekvivalent'], 4));
             //data = storeTblValues()
             //data = JSON.stringify(data);
             for (var i = 0; i < data.length; i++) {
                 for (var key in data[i]) {
                     if (col.indexOf(key) === -1) {
                         col.push(key);
                     }
                 }
             }
             // CREATE DYNAMIC TABLE.
             var table = document.getElementById('st')//.createElement("table");
             $('#st').empty();
             // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
             var tr = table.insertRow(-1);                   // TABLE ROW.
             for (var i = 0; i < col.length; i++) {
                 var th = document.createElement("th");      // TABLE HEADER.
                 th.innerHTML = col[i];
                 tr.appendChild(th);
             }
             // ADD JSON DATA TO THE TABLE AS ROWS.
             for (var i = 0; i < data.length; i++) {
                 tr = table.insertRow(-1);
                 for (var j = 0; j < col.length; j++) {
                     var tabCell = tr.insertCell(-1);
                     tabCell.innerHTML = data[i][col[j]];
                 }
             }

             // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
             table.className = "table table-striped table-bordered";
             //var divContainer = document.getElementById("showData");
             //divContainer.innerHTML = "";
             //divContainer.appendChild(table);
         });

    });
});
function fun() {
    var x = document.getElementById("svipredmeti").rows[0].innerHTML;
    document.getElementById('demo').innerHTML = x;
}

