$(document).ready(function ()
{
    //prikazuje div element 'pr'
    $('#pr').show();
    $.when(btnProslediAjax).then(btnProslediAjaxDone);

});

function btnProslediAjax()
{
    $("button#prosledi").on('click', function (e)
    {
        if ($('#upisPrograma').val() != 'none' && $.isNumeric($("#steceniESPB").val())) {
            $.ajax({
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
    });
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