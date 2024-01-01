/*
****************************************************
 nazwa funkcji: ApplySearch
 parametry wejściowe: brak
 wartość zwracana: brak
 informacje: funkcja filtruje rekordy przez dane wpisane w formularzu
****************************************************
*/
function applySearch(){
    var code = $('#codeSearch').val().toLowerCase();
    var currency = $('#currencySearch').val().toLowerCase();
    var midStart = ($('#midStart').val() == '') ? 0 : Number($('#midStart').val());
    var midEnd = ($('#midEnd').val() == '') ? 100000 : Number($('#midEnd').val());

    $('.itemDescription').hide();
    $('.item').data('open', false);
    $('.window').html("");

    $('.item.searchable').filter(function() {
        return (
            $(this).find('.code').text().toLowerCase().includes(code) &&
            $(this).find('.currency').text().toLowerCase().includes(currency) &&
            Number($(this).find('.mid').text()) > midStart &&
            Number($(this).find('.mid').text()) < midEnd
        );
    }).show();

    $('.item.searchable').filter(function() {
        return !(
            $(this).find('.code').text().toLowerCase().includes(code) &&
            $(this).find('.currency').text().toLowerCase().includes(currency) &&
            Number($(this).find('.mid').text()) > midStart &&
            Number($(this).find('.mid').text()) < midEnd
        );
    }).hide();
}

/*
****************************************************
 nazwa funkcji: emptyComparison
 parametry wejściowe: brak
 wartość zwracana: bool - zwraca true jeżeli nie ma rekordów dodanych do porównania
 informacje: funkcja sprawdza, czy lista rekordów dodanych do porównania jest pusta. Jeżeli jest pusta, wyświetla komunikat
****************************************************
*/

function emptyComparison(){
    if($('.item').length == $('.notCompared').length){
        window.alert("Brak walut dodanych do porównania.");
        return true;
    }
    return false;
}

/*
****************************************************
 nazwa funkcji: sortTable
 parametry wejściowe: 
    columnIndex - indeks kolumny według której ma być sortowana tabela (0 - kod, 1 - waluta, 2 - kurs średni)
    ascending - true, jeżeli tabela ma być sortowana rosnąco
 wartość zwracana: brak
 informacje: funkcja sortuje tabelę według wybranej kolumny rosnąco lub malejąco
****************************************************
*/
function sortTable(columnIndex, ascending){
    $('.itemDescription').hide();
    $('.item').data('open', false);
    $('.window').html("");

    for(var i = 1; i < $('.item').length; i++){
        if(columnIndex == 2){
            if(ascending){
                if(Number($('.item').eq(i).find('td').eq(columnIndex).text()) < Number($('.item').eq(i - 1).find('td').eq(columnIndex).text())){
                    var offset = 0;
                    while(Number($('.item').eq(i).find('td').eq(columnIndex).text()) < Number($('.item').eq(i - (offset + 1)).find('td').eq(columnIndex).text()) && i - offset > 0){
                        offset++;
                    }
                    $('.item').eq(i).detach().insertBefore($('.item').eq(i - offset));
                    $('.itemDescription').eq(i).detach().insertBefore($('.item').eq(i - offset + 1));
                }
            }
            else{
                if(Number($('.item').eq(i).find('td').eq(columnIndex).text().toLowerCase()) > Number($('.item').eq(i - 1).find('td').eq(columnIndex).text().toLowerCase())){
                    var offset = 0;
                    while(Number($('.item').eq(i).find('td').eq(columnIndex).text().toLowerCase()) > Number($('.item').eq(i - (offset + 1)).find('td').eq(columnIndex).text().toLowerCase()) && i - offset > 0){
                        offset++;
                    }
                    $('.item').eq(i).detach().insertBefore($('.item').eq(i - offset));
                    $('.itemDescription').eq(i).detach().insertBefore($('.item').eq(i - offset + 1));
                }
            }
        }
        else{
            if(ascending){
                if($('.item').eq(i).find('td').eq(columnIndex).text().toLowerCase() < $('.item').eq(i - 1).find('td').eq(columnIndex).text().toLowerCase()){
                    var offset = 0;
                    while($('.item').eq(i).find('td').eq(columnIndex).text().toLowerCase() < $('.item').eq(i - (offset + 1)).find('td').eq(columnIndex).text().toLowerCase() && i - offset > 0){
                        offset++;
                    }
                    $('.item').eq(i).detach().insertBefore($('.item').eq(i - offset));
                    $('.itemDescription').eq(i).detach().insertBefore($('.item').eq(i - offset + 1));
                }
            }
            else{
                if($('.item').eq(i).find('td').eq(columnIndex).text().toLowerCase() > $('.item').eq(i - 1).find('td').eq(columnIndex).text().toLowerCase()){
                    var offset = 0;
                    while($('.item').eq(i).find('td').eq(columnIndex).text().toLowerCase() > $('.item').eq(i - (offset + 1)).find('td').eq(columnIndex).text().toLowerCase() && i - offset > 0){
                        offset++;
                    }
                    $('.item').eq(i).detach().insertBefore($('.item').eq(i - offset));
                    $('.itemDescription').eq(i).detach().insertBefore($('.item').eq(i - offset + 1));
                }
            }
        }
    }
}

/*
****************************************************
 nazwa funkcji: sortTable
 parametry wejściowe: 
    columnIndex - indeks kolumny według której ma być sortowana tabela (0 - kod, 1 - waluta, 2 - kurs średni)
    selectedSort - tablica opisująca poprzedni typ sortowania tabeli ([0] - poprzedni indeks kolumny, [1] - poprzedni typ sortowania tabeli, true jeśli rosnąco)
 wartość zwracana: selectedSort - nowy typ sortowania tabeli ([0] - indeks kolumny, [1] - typ sortowania tabeli, true jeśli rosnąco)

 informacje: funkcja przypisywana do kliknięcia nagłówka tabeli, sortuje tabelę według wybranej kolumny i aktualizuje ikony w nagłówku.
 Domyślnie sortuje rosnąco, jeżeli kliknięto ten sam nagłówek dwa razy, sortuje malejąco.
****************************************************
*/

function applySort(columnIndex, selectedSort) {
    $('.sortIcon').removeClass("fa-sort-up fa-sort-down");
    $('.sortIcon').addClass("fa-sort");

    if(selectedSort[0] == columnIndex){
        selectedSort[1] = !selectedSort[1];
    }
    else selectedSort = [columnIndex , true];
    
    sortTable(selectedSort[0], selectedSort[1]);
    $('.sortIcon').eq(selectedSort[0]).removeClass("fa-sort");
    $('.sortIcon').eq(selectedSort[0]).addClass(selectedSort[1] ? "fa-sort-up" : "fa-sort-down");

    return selectedSort;
}

/*
****************************************************
 nazwa funkcji: doneByTable
 parametry wejściowe: 
    result - wynik wykonania funkcji $.ajax
    letter - oznaczenie tabeli użytej w parametrze 'url' funkcji $.ajax
    comparisonChart - zmienna z przypisanym do niej wykresem biblioteki CanvasJS, służącym do porównywania walut
 wartość zwracana: brak

 informacje: funkcja wykonywana w metodzie done działającej na wynikach funkcji $.ajax. 
 Wypisuje otrzymane wyniki w postaci tabeli, przypisuje funkcje wykonywane po kliknięciu.
 Do każdego wyniku tworzy dwa nowe wiersze o klasach .item i .itemDescription oraz przypisuje im klasę tableA lub tableB w zależności od parametru letter.
 Wiersz .itemDescription jest domyślnie ukryty, otwiera się po kliknięciu wiersza .item
 Po otwarciu .itemDescription skrypt pobiera informacje o danej walucie za pomocą funkcji $.ajax, tworzy wykres biblioteki CanvasJS i tabelę wyników dla pojedynczej waluty.
 Wykres można rozwijać, a walutę dodać lub usunąć z porównania.
****************************************************
*/

function doneByTable(result, letter, comparisonChart){
    var tableClass = '.table' + letter;
    $.each(result[0].rates, (index, r) => {
        $('#content').html(
            $('#content').html() + 
            "<tr class='item notCompared searchable table" + letter + "' data-open='false'>" +
                "<td class='code'>" + r.code + "</td>" +
                "<td class='currency'>" + r.currency + "</td>" +
                "<td class='mid'>" + r.mid + "</td>" +
            "</tr>" +
            "<tr class='itemDescription table" + letter + "'>" +
                "<td colspan='3'>" +
                    "<div id='chartContainer" + r.code + "' class='chart'></div>" +
                    "<div class='d-flex justify-content-center m-2'>" +
                        "<button type='button' class='btn btn-success col-3 addToComparison'>" + 
                            "<i class='fa-solid fa-plus'></i> " +
                            "Dodaj do porównania" +
                        "</button>" + 
                        "<button type='button' class='btn btn-danger col-3 removeComparison'>" + 
                            "<i class='fa-solid fa-minus'></i> " +
                            "Usuń z porównania " +
                        "</button>" + 
                    "</div>" +
                    "<div class='innerTable overflow-auto container'>" +
                        "<table class='table table-dark table-sm'>" +
                            "<thead>" +
                                "<tr>" +
                                    "<th class='col-5'>Numer</th>" +
                                    "<th class='col-5'>Data</th>" +
                                    "<th class='col-2'>Kurs średni</th>" +
                                "</tr>" +
                            "</thead>" +
                            "<tbody class='window'></tbody>" +
                        "</table>" +
                    "</div>" +
                    "<div class='d-flex justify-content-center m-2'>" +
                        "<button type='button' class='btn btn-secondary col-3 seeMoreShow'>" + 
                            "Pokaż więcej " +
                            "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' class='bi bi-arrow-down' viewBox='0 0 20 20'>" +
                                "<path fill-rule='evenodd' d='M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1'/>" +
                            "</svg>" +
                        "</button>" + 
                        "<button type='button' class='btn btn-secondary col-3 seeMoreHide'>" +
                            "Pokaż mniej " +
                            "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' class='bi bi-arrow-up' viewBox='0 0 20 20'>" +
                                "<path fill-rule='evenodd' d='M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5' />" +
                            "</svg>" +
                        "</button>" +
                    "</div>" +
                "</td>" +
            "</tr>"
        );
        //domyślne ukrycie .itemDescription oraz przycisków o klasach .seeMoreHide i .removeComparison
        $(tableClass + '.itemDescription').eq(index).hide();
        $(tableClass + '.itemDescription .seeMoreHide').eq(index).hide();
        $(tableClass + '.itemDescription .removeComparison').eq(index).hide();
    });

    applySearch();

    $('#content').on('click', '.item' + tableClass, function(){
        
        var id = $('.item' + tableClass).index(this);
        
        if(!$(this).data('open')){
            $('.itemDescription').hide();
            $('.item').data('open', false);
            $('.window').html("");
            
            $(tableClass + '.itemDescription').eq(id).show();
            $(this).data('open', true);
            var code = $(this).find('.code').text();
            var currency = $(this).find('.currency').text();

            $.ajax({
                url: "http://api.nbp.pl/api/exchangerates/rates/" + letter + "/" + code + "/last/255/",
                headers: {'Accept': 'application/json'},
                method: "GET"
            }).done((result2) => {
                var dataP = []; //tablica do utworzenia wykresu
                $.each(result2.rates, (index, r2) => {
                    //ostatnie 8 wpisów nie zawiera klasy .seeMoreItem, nie są one ukrywane
                    if(index >= (255 - 8)){
                        $(tableClass + ' .window').eq(id).html(
                        "<tr>" +
                            "<td>" + r2.no + "</td>" +
                            "<td>" + r2.effectiveDate + "</td>" +
                            "<td>" + r2.mid + "</td>" +
                        "</tr>" + 
                        $(tableClass + ' .window').eq(id).html());
                    }
                    else{
                        $(tableClass + ' .window').eq(id).html(
                        "<tr class='seeMoreItem'>" + 
                            "<td>" + r2.no + "</td>" +
                            "<td>" + r2.effectiveDate + "</td>" +
                            "<td>" + r2.mid + "</td>" +
                        "</tr>" + 
                        $(tableClass + ' .window').eq(id).html());
                    }
                    dataP[index] = {
                        x: new Date(r2.effectiveDate),
                        y: r2.mid
                    };
                });
                
                $(tableClass + ' .window').eq(id).find('.seeMoreItem').hide();
                //usuwanie funkcji przypisanych dla zdarzenia click w klasie .itemDescription
                $(tableClass + '.itemDescription').off('click', '.seeMoreShow');
                $(tableClass + '.itemDescription').off('click', '.seeMoreHide');
                $(tableClass + '.itemDescription').off('click', '.addToComparison');
                $(tableClass + '.itemDescription').off('click', '.removeComparison');

                //funkcja dla przycisku "Pokaż więcej" (.seeMoreShow)
                $(tableClass + '.itemDescription').eq(id).on('click', '.seeMoreShow', function(){
                    $(tableClass + '.itemDescription').eq(id).find('.seeMoreItem').show();
                    $(tableClass + '.itemDescription').eq(id).find('.seeMoreHide').show();
                    $(tableClass + '.itemDescription').eq(id).find('.seeMoreShow').hide();
                });

                //funkcja dla przycisku "Pokaż mniej" (.seeMoreHide)
                $(tableClass + '.itemDescription').eq(id).on('click', '.seeMoreHide', function(){
                    $(tableClass + '.itemDescription').eq(id).find('.seeMoreItem').hide();
                    $(tableClass + '.itemDescription').eq(id).find('.seeMoreHide').hide();
                    $(tableClass + '.itemDescription').eq(id).find('.seeMoreShow').show();
                });

                //funkcja dla przycisku "Dodaj do porównania" (.addToComparison)
                //usuwa klasę .notCompared i dopisuje nowe dane do wykresu comparisonChart
                $(tableClass + '.itemDescription').eq(id).on('click', '.addToComparison', function(){
                    $(this).hide();
                    $(this).parent().find('.removeComparison').show();
                    $(tableClass + '.item').eq(id).removeClass('notCompared');
                    comparisonChart.options.data.push({
                        type: "line",
                        showInLegend: true,
                        name: code,
                        markerType: "none",
                        xValueFormatString: "DD MMM YYYY",
                        color: "hsl(" + 360 * Math.random() + ',' +(50 + 55 * Math.random()) + '%,' + (70 + 10 * Math.random()) + '%)',
                        dataPoints: dataP
                    });
                });
                
                //funkcja dla przycisku "Usuń z porównania" (.removeComparison)
                //dodaje klasę .notCompared i usuwa walutę z wykresu comparisonChart
                $(tableClass + '.itemDescription').eq(id).on('click', '.removeComparison', function(){
                    $(this).hide();
                    $(this).parent().find('.addToComparison').show();
                    $(tableClass + '.item').eq(id).addClass('notCompared');
                    comparisonChart.options.data = $.grep(comparisonChart.options.data, function (item) {
                        return item.name != code;
                    });
                    comparisonChart.render();

                    //jeżeli porównanie jest otwarte, usunięcie z porównania powoduje ukrycie elementu i usunięcie go z wyszukiwania
                    if($('#openComparison').data('open')){
                        $(tableClass + '.item').eq(id).removeClass('searchable');
                        $(tableClass + '.item').eq(id).hide();
                        $(tableClass + '.itemDescription').eq(id).hide();

                        //jeżeli nie pozostały żadne porównywane waluty, porównanie zostaje zamknięte
                        if(emptyComparison()){
                            $('#comparisonChart').hide();
                            $('.notCompared').show();
                            $('.itemDescription').hide();
                            $('.item').data('open', false);
                            $('.window').html("");
                    
                            $('#codeSearch').val('');
                            $('#currencySearch').val('');
                            $('#midStart').val('');
                            $('#midEnd').val('');

                            $('#openComparison').data('open', false);
                            $('.item').addClass('searchable');
                            applySearch();
                        }
                    }

                });
                
                //nowy wykres dla konkretnej waluty
                var chart = new CanvasJS.Chart("chartContainer" + code,{
                    theme: "dark1",
                    zoomEnabled: true,
                    title :{
                        text: currency,
                        fontFamily: "verdana"
                    },
                    axisX: {						
                        title: "Data",
                        valueFormatString: "DD MM YYYY",
                        fontFamily: "verdana"
                    },
                    axisY: {						
                        title: "PLN"
                    },
                    data: [{
                        type: "line",
                        color: "cyan",
                        fontFamily: "verdana", 
                        dataPoints : dataP
                    }]
                });

                chart.render();

            })
        }
        else{
            $(tableClass + '.itemDescription').eq(id).hide();
            $(this).data('open', false);
            $(tableClass + ' .window').eq(id).html("");
        }
    });
}
/************************** 
 * funkcja główna programu
**************************/

$(document).ready(() => {
    
    //wykres porównawczy jest domyślnie ukryty
    $('#comparisonChart').hide();

    //nowy wykres CanvasJS przypisany do elementu o id #comparisonChart
    var comparisonChart = new CanvasJS.Chart("comparisonChart",{
        theme: "dark1",
        zoomEnabled: true,
        title :{
            text: "Porównanie walut",
            fontFamily: "verdana"
        },
        axisX: {						
            title: "Data",
            valueFormatString: "DD MM YYYY",
            fontFamily: "verdana",
            crosshair: {
                enabled: true,
			    snapToDataPoint: true
            }
        },
        toolTip: {
            shared: true
        },
        axisY: {						
            title: "PLN",
            includeZero: true,
            crosshair: {
                enabled: true
            }
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            horizontalAlign: "center",
            dockInsidePlotArea: true,
            itemclick: function (e){
                if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else{
                    e.dataSeries.visible = true;
                }
                comparisonChart.render();
            }
        },
        data: []
    });

    //przypisanie funkcji applySearch do zdarzenia w polach wyszukiwarki
    $('.searchInput').on('keyup', function() {
        applySearch();
    });

    //przypisanie otwierania i zamykania porównania do kliknięcia elementu o id #openComparison
    //włączenie porównania zawęża zasięg wyszukiwarki do porównywanych walut (dodaje klasę .searchable)
    $('#openComparison').on('click', function() {
        if(!emptyComparison()){
            $('#comparisonChart').toggle();
            comparisonChart.render();
            $('.item').show();
            $('.notCompared').toggle();
            $('.itemDescription').hide();
            $('.item').data('open', false);
            $('.window').html("");
    
            $('#codeSearch').val('');
            $('#currencySearch').val('');
            $('#midStart').val('');
            $('#midEnd').val('');
    
            if($('#openComparison').data('open')){
                $('#openComparison').data('open', false);
                $('.item').addClass('searchable');
                applySearch();
            }
            else{
                $('#openComparison').data('open', true);
                $('.item').removeClass('searchable');
                $('.item:not(.notCompared)').addClass('searchable');
                applySearch();
            }
        }
    });

    //domyślne ustawienia sortowania
    var selectedSort = [-1 , true]; 
    //przypisanie funkcji applySort do nagłówków tabeli
    $('#codeSort').on('click', function() {
        selectedSort = applySort(0, selectedSort);
    })

    $('#currencySort').on('click', function() {
        selectedSort = applySort(1, selectedSort);
    })

    $('#midSort').on('click', function() {
        selectedSort = applySort(2, selectedSort);
    })

    

    $.ajax({
        url: "http://api.nbp.pl/api/exchangerates/tables/A",
        headers: {'Accept': 'application/json'},
        method: "GET"
    }).done((result) => doneByTable(result, "A", comparisonChart));

    $.ajax({
        url: "http://api.nbp.pl/api/exchangerates/tables/B",
        headers: {'Accept': 'application/json'},
        method: "GET"
    }).done((result) => doneByTable(result, "B", comparisonChart));
})