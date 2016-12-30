$(document).ready(function ()
{
    //prikazuje div element 'pr'
    $('#pr').show();
    $("button#prosledi").on('click', function (e)
    {
        if ($('#upisPrograma').val() != 'none' && $.isNumeric($("#steceniESPB").val())) {
            $.when(btnProslediAjax())
                .done(function (data)
                {
                    btnProslediAjaxDone(data);
                });
            //btnProslediAjax().done(btnProslediAjaxDone);

            $.when(tabelaOstalihAjax())
                .done(function (data)
                {
                    tabelaOstalihAjaxResponse(data);

                });
            $('table#vazniostali tbody input[type="checkbox"]').on('change', function ()
            {
                console.log("Pozvana calculateOstalih");
                //calculateOstalih();
            });
        }
    });
    $('table#vazniostali tbody input[type="checkbox"]').on('change', function ()
    {
        console.log("Pozvana calculateOstalih");
        //calculateOstalih();
    });


});

function btnProslediAjax()
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

function tabelaOstalihAjax()
{
    return $.ajax({
        data: {
            'upisPrograma': $('#upisPrograma').val()
        },
        type: 'POST',
        url: $SCRIPT_ROOT + '/_process_cetiri',
        //contentType: 'application/json',
        dataType: 'json'
    });
}

function tabelaOstalihAjaxResponse(d)
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
}

function btnProslediAjaxDone(data)
{
    var trHTML = '';
    console.log("Pozvana done btnProsledi Ajax");

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
    //..i kreira tabela sa id=target_table_id
    $('#target_table_id tbody').append(trHTML);
    //$('#pr').hide();
    console.log("Zavrsena done btnProsledi Ajax");

    $("button#prosledi").attr("disabled", true);
    $('#tabelaPrograma').show();
    $("#tabelaOstalih").show();
    $("#kontrolnaTabela").show();
    $("#tabelaObaveznih").show();
}