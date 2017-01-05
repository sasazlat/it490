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
            $("#greska").hide();
            btnAjax()//od servera se dobija..
                .then(btnSuccessAjaxResp)
                .then(function (trHTML)
                {
                    //..i kreira tabela sa id=target_table_id
                    $('#target_table_id tbody').append(trHTML);
                    $("button#prosledi").attr("disabled", true);
                    $('#tabelaPrograma').show();
                    //$('.nav-tabs a[href="#tp"]').tab('show');
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
                })
                .done(function ()
                {
                    createOstalih();
                });
        }
        else {
            $("#greska").show();
        }

        $("ul.nav-tabs li").on('click', function ()
        {
            var idx = $(this).index();
            switch (idx) {
                case 1:
                    $("#target_table_id tbody input[type=checkbox]").on("change", function ()
                    {
                        calculatePriznati();
                    });
                    break;
                case 2:
                    calculateOstalih();
                    $('table#vazniostali tbody input[type="checkbox"]').on('change', function ()
                    {
                        calculateOstalih();
                    });
                    break;
                case 3:
                    break;
                case 4:
                    createKonacna();
                    break;
                default:
            }
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
    var sov = storeOstalihValues();
    var arrayKonacni = tableData.concat(sov);
    var kon = $.uniqueSort(arrayKonacni);
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
                   '</td><td><label><input ' + 'value= ' + value.espb + ' type="checkbox" id="ostalih">Додати</input></label>' +
                   '</td></tr>';
            });
            //..i kreira tabela sa id=tabelaOstalih
            $('#vazniostali tbody').append(html);
        })
        .done(function ()
        {
            calculateOstalih();

        });
}

//iscitava tabelu obaveznih predmeta
function storeTblValues()
{
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

//iscitava tabelu ostalih vaznih predmeta
function storeOstalihValues()
{
    var tableData = new Array();
    $('#vazniostali input:checkbox:checked').each(function (row, tr)
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

//povratni poaci sa servera - tabela osnovnih
//predmeta studijske grupe
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
           '</td><td><label><input ' + 'value= ' + value.espb + ' type="checkbox" id="idch">Признат</input></label>' +
           '</td></tr>';
    });
    return trHTML;
}

//ajax ka serveru
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
