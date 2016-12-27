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
            })//od servera se dobija..
                .done(function (data)
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

                    calculatePriznati();
                    createKonacna();
                    console.log("Pozvana createOstalih");

                    createOstalih();
                    console.log("Zavrsena createOstalih");
                    calculateOstalih();

                    $('#target_table_id tbody input[type="checkbox"]').on('change', function ()
                    {
                        console.log("Pozvana calculatePriznati");
                        calculatePriznati();
                        //proveriti kako radi bez when funkcije
                        //$.when(calculatePriznati()).done(function ()
                        //{
                        createKonacna();
                        console.log("Pozvana createKonacna");
                        //});
                        calculateOstalih();

                    });


                    //dodaje promenljivu u naslov tabela
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
                });
        }
        else {
            alert("Проверите да ли сте унели број ЕСП бодова или изабрали Програм УМ");
        }
        e.preventDefault();

    });

    //obelezavanje cekboksa


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
        console.log("unutar Zavrsena calculatePriznati()");
    }

    //matematicki proracun za dodatne ostale
    function calculateOstalih()
    {
        var total1 = 0;
        var total2 = 0;
        total2 = parseInt($("#5").text());
        $("#vazniostali tbody input[type=checkbox]").each(function (i, val)
        {
            var checkbox_cell_is_checked = $(this).is(':checked');
            // Is it checked?
            if (checkbox_cell_is_checked) {
                $(this).closest('tr').find('td:eq(5)').text(parseInt($(this).val()));
                total1 += parseInt($(this).val());
                total2 = parseInt($("#5").text()) - total1;
                $(this).parent().parent().addClass('selected').siblings().removeClass('selected');
            }
            else {
                $(this).closest('tr').find('td:eq(5)').text('');
            }
            $("#sd5").text(total2);
        });
    }

    //iscitava tabelu obaveznih predmeta
    function storeTblValues()
    {
        console.log("unutar storeTblValues");
        var tableData = new Array();
        $('#target_table_id input:checkbox:not(:checked)').each(function (row, tr)
        {
            var tr = $(this).closest('tr');
            tableData[row] = {
                'id': $(tr).find('td:eq(0)').text()
                , 'sifra': $(tr).find('td:eq(1)').text()
                , 'punoIme': $(tr).find('td:eq(2)').text()
                , 'espb': $(tr).find('td:eq(3)').text()
                , 'semestar': $(tr).find('td:eq(4)').text()
            }
        });
        console.log(tableData);
        return tableData;
    }


    //kreira novu tabelu na osnovu
    //tabele obaveznih
    function createKonacna()
    {
        console.log("Unutar createKonacna");

        var tableData = storeTblValues();
        console.log("Pozvana storeTblValues");
        var trHTML = '';
        $.each(tableData, function (key, value)
        {
            trHTML +=
              '<tr><td>' + value.id +
              '</td><td>' + value.sifra +
              '</td><td>' + value.punoIme +
              '</td><td>' + value.espb +
              '</td><td>' + value.semestar +
              '</td></tr>';
        });
        var trh = storeOstalihValues();
        $("#obavezni tbody tr").remove();
        $('#obavezni tbody').append(trHTML);
        $('#obavezni tbody').append(trh);
        console.log("Unutar createKonacna, obavezni tabela gotova");


    }


    function createOstalih()
    {
        //uslov za kreiiranje tabeleOstalih
        console.log("Unutar createOstalih");
        if (parseInt($("#4").text()) > 0) {
            $.ajax({
                data: {
                    'upisPrograma': $('#upisPrograma').val()
                },
                type: 'POST',
                url: $SCRIPT_ROOT + '/_process_cetiri',
                //contentType: 'application/json',
                dataType: 'json'
            }).done(function (d)
            {
                var html = '';
                console.log("Pozvana done createOstalih Ajax");
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
                $('table#vazniostali tbody input[type="checkbox"]').on('change', function ()
                {
                    //calculatePriznati();
                    //proveriti kako radi bez when funkcije
                    //$.when(calculatePriznati()).done(function ()
                    //{
                    //createKonacna();
                    //});
                    console.log("Pozvana calculateOstalih");
                    calculateOstalih();
                });

            });
        }
    }

    function storeOstalihValues()
    {
        console.log("Pozvana storeOstalihValues");
        var tableData = new Array();
        $("#vazniostali tbody input[type=checkbox]").each(function (row, tr)
        {
            var checkbox_cell_is_checked = $(this).is(':checked');
            var tr = $(this).closest('tr');
            if (checkbox_cell_is_checked) {
                console.log("unutar storeOstalihValues");
                tableData[row] = {
                    'id': $(tr).find('td:eq(0)').text()
                    , 'sifra': $(tr).find('td:eq(1)').text()
                    , 'punoIme': $(tr).find('td:eq(2)').text()
                    , 'espb': $(tr).find('td:eq(3)').text()
                    , 'semestar': $(tr).find('td:eq(4)').text()
                }
            }
        });

        console.log(tableData);
        return tableData;
    }
});