var polje5 = 0;

$(document).ready(function ()
{
    //prikazuje div element 'pr'
    $('#pr').show();
    //posle klika prosledi sledi
    $("button#prosledi").on('click', function (e)
    {
        //provera polja upisprograma i steceniESPB koji su obavezni
        if ($('#upisPrograma').val() != 'none' && $.isNumeric($("#steceniESPB").val())) {
            //ako je u redu onda ajax do view funkcije _process_projava()
            btnAjax()//od servera se dobija..
                .then(btnSuccessAjaxResp)
                .then(function (trHTML)
                {
                    //..i kreira tabela sa id=target_table_id
                    $('#target_table_id tbody').append(trHTML);
                    $("button#prosledi").attr("disabled", true);
                    $('#tabelaPrograma').show();
                    $("#tabelaOstalih").show();
                    $("#kontrolnaTabela").show();
                    $("#tabelaObaveznih").show();
                    $(".fakultet").text(function ()
                    {
                        var valUpisa = $('#upisPrograma').val();
                        if (valUpisa == 'fit') {
                            return "ФИТ";
                        }
                        else if (valUpisa == 'fdu') {
                            return "ФДУ";
                        }
                        else {
                            return "ФМ";
                        }
                    });
                    calculatePriznati();
                }).done(function ()
                {
                    createOstalih();
                });
        }
        else {
            alert("Проверите да ли сте унели број ЕСП бодова или изабрали Програм УМ");
        }

        $("#tabelaObaveznih").on("click", function ()
        {
            createKonacna();
        });

        $("#tabelaOstalih").on("click", function ()
        {
            calculateOstalih();
        });

        $("#tabelaPrograma").on("click", function ()
        {
            $("#target_table_id tbody input[type=checkbox]").on("change", function ()
            {
                calculatePriznati();
            });
        });



        e.preventDefault();

    });
});
//matematicki roracuni i ispunjavanje tabela
function calculatePriznati()
{
    var totalPriznati = 0;
    var totalDodati = 0;
    var steceniESPB = parseInt($('#steceniESPB').val());
    $("#target_table_id tbody input[type=checkbox]").each(function (i, val)
    {
        var checkbox_cell_is_checked = $(this).is(':checked');
        // Is it checked?
        if (checkbox_cell_is_checked) {
            $(this).closest('tr').find('td:eq(5)').text(parseInt($(this).val()));
            $(this).closest('tr').find('td:eq(6)').text('');
            totalPriznati += parseInt($(this).val());
            $(this).parent().parent().addClass('selected').siblings().removeClass('selected');
        }
        else {
            $(this).closest('tr').find('td:eq(5)').text('');
            $(this).closest('tr').find('td:eq(6)').text(parseInt($(this).val()));
            var dodati = parseInt($(this).closest('tr').find('td:eq(6)').text());
            totalDodati += dodati;
        }
        $("#sum5").text(totalPriznati);
        $("#sum6").text(totalDodati);
        $("#0").text(steceniESPB - parseInt($("#sum5").text()));
        $("#1").text($("#sum5").text());
        $("#3").text($("#sum6").text());
        $("#4").text(parseInt($("#0").text()) + parseInt($("#1").text()) + parseInt($("#3").text()));
        $("#5").text(parseInt(240 - $("#4").text()));

    });
}

//matematicki proracun za dodatne ostale
function calculateOstalih()
{
    var total1 = 0;
    var value5 = parseInt($("#5").text());
    var total2 = value5;
    $("#vazniostali tbody input[type=checkbox]").each(function (i, val)
    {
        var checkbox_cell_is_checked = $(this).is(':checked');
        // Is it checked?
        if (checkbox_cell_is_checked) {
            $(this).closest('tr').find('td:eq(5)').text(parseInt($(this).val()));
            total1 += parseInt($(this).val());
            total2 = value5 - total1;
            $(this).parent().parent().addClass('selected');
        }
        else {
            $(this).closest('tr').find('td:eq(5)').text('');
            $(this).parent().parent().removeClass('selected');
        }
    });
    $("#sd5").text(total2);
}

//kreira novu tabelu na osnovu
//tabele obaveznih
function createKonacna()
{
    var tableData = storeTblValues();
    console.log(tableData);
    var sov = storeOstalihValues();
    console.log(sov);
    var arrayKonacni = tableData.concat(sov);
    //arrayKonacni.unique();
    var kon = $.uniqueSort(arrayKonacni);
    console.log(kon);
    var trHTML = '';
    $.each(kon, function (key, value)
    {
        trHTML +=
          '<tr><td>' + value.id +
          '</td><td>' + value.sifra +
          '</td><td>' + value.punoIme +
          '</td><td>' + value.espb +
          '</td><td>' + value.semestar +
          '</td></tr>';
    });
    $("#obavezni tbody tr").remove();
    $('#obavezni tbody').append(trHTML);
}

function createOstalih()
{
    //uslov za kreiiranje tabeleOstalih
    console.log("Unutar createOstalih");
    //if (parseInt($("#5").text()) > 0) {
        $.ajax({
            data: {
                'upisPrograma': $('#upisPrograma').val()
            },
            type: 'POST',
            url: $SCRIPT_ROOT + '/_process_cetiri',
            //contentType: 'application/json',
            dataType: 'json'
        })
            .then(function (d)
            {
                var html = '';
                $.each(d, function (key, value)
                {
                    html +=
                       '<tr><td>' + value.id +
                       '</td><td>' + value.sifra +
                       '</td><td>' + value.punoIme +
                       '</td><td>' + value.espb +
                       '</td><td>' + value.semestar +
                       '</td><td>' + value.dodatESPB +
                       '</td><td><input ' + 'value= ' + value.espb + ' type="checkbox" id="idostalih">Додати</input>' +
                       '</td></tr>';
                });
                //..i kreira tabela sa id=tabelaOstalih
                $('#vazniostali tbody').append(html);
                console.log("Zavrsena done createostalih Ajax");
            })
            .then(function ()
            {
                $('#tabelaOstalih').on('click', function ()
                {
                    console.log("Pozvana calculateOstalih");
                    calculateOstalih();
                    $('table#vazniostali tbody input[type="checkbox"]').on('change', function ()
                    {
                        console.log("Pozvana calculateOstalih");
                        calculateOstalih();
                    });
                });
            });
    //}
}

//iscitava tabelu obaveznih predmeta
function storeTblValues()
{
    console.log("Pozvana storeTblValues");
    var tableData = new Array();
    $('#target_table_id input:checkbox:not(:checked)').each(function (row, tr)
    {
        var $tr = $(this).closest('tr');
        tableData[row] = {
            'id': $tr.find('td:eq(0)').text()
            , 'sifra': $tr.find('td:eq(1)').text()
            , 'punoIme': $tr.find('td:eq(2)').text()
            , 'espb': $tr.find('td:eq(3)').text()
            , 'semestar': $tr.find('td:eq(4)').text()
        }
    });
    return tableData;
}

function storeOstalihValues()
{
    console.log("Pozvana storeOstalihValues");
    var tableData = new Array();
    $("#vazniostali tbody input[type=checkbox]").each(function (row, tr)
    {
        var checkbox_cell_is_checked = $(this).is(':checked');
        var $tr = $(this).closest('tr');
        if (checkbox_cell_is_checked) {
            console.log("unutar storeOstalihValues");
            tableData[row] = {
                'id': $tr.find('td:eq(0)').text()
                , 'sifra': $tr.find('td:eq(1)').text()
                , 'punoIme': $tr.find('td:eq(2)').text()
                , 'espb': $tr.find('td:eq(3)').text()
                , 'semestar': $tr.find('td:eq(4)').text()
            }
        }
    });
    return tableData;
}

function btnSuccessAjaxResp(data)
{
    var trHTML = '';
    $.each(data, function (key, value)
    {
        trHTML +=
           '<tr><td>' + value.id +
           '</td><td>' + value.sifra +
           '</td><td>' + value.punoIme +
           '</td><td>' + value.espb +
           '</td><td>' + value.semestar +
           '</td><td>' + value.priznatESPB +
           '</td><td>' + value.espb +
           '</td><td><input ' + 'value= ' + value.espb + ' type="checkbox" id="idch"> Признат</input>' +
           '</td></tr>';
    });
    return trHTML;
}

function btnAjax()
{
    return $.ajax({
        data: {
            ime: $('#ime').val(),
            email: $('#email').val(),
            telefon: $('#telefon').val(),
            vsu: $('#vsu').val(),
            psp: $('#psp').val(),
            steceniESPB: $('#steceniESPB').val(),
            diploma: $('#diploma').val(),
            upisPrograma: $('#upisPrograma').val()
        },
        type: 'POST',
        url: $SCRIPT_ROOT + '/_process_prijava',
        dataType: 'json'
    });

}

Array.prototype.unique = function ()
{
    var o = {}, i, l = this.length, r = [];
    for (i = 0; i < l; i += 1) o[this[i]] = this[i];
    for (i in o) r.push(o[i]);
    return r;
};