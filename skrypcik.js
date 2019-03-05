
        //zmiennych colors i tab w tym zadaniu nie zmieniaj
        const colors = ['#ffffff', '#F8AA00', '#7E1C03', '#DB0F3B', '#0026FF'];
        const tab = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,3,3,3,3,3,0,0,0,0,0],[0,0,0,3,3,3,3,3,3,3,3,0,0,0],[0,0,0,2,2,2,1,1,2,1,0,0,0,0],[0,0,2,1,2,1,1,1,2,1,1,1,0,0],[0,0,2,1,2,2,1,1,1,2,1,1,1,0],[0,0,2,2,1,1,1,1,2,2,2,2,0,0],[0,0,0,0,1,1,1,1,1,1,0,0,0,0],[0,0,0,3,3,4,3,3,3,0,0,0,0,0],[0,0,3,3,3,4,3,3,4,3,3,3,0,0],[0,3,3,3,3,4,4,4,4,3,3,3,3,0],[0,1,1,3,4,1,4,4,1,4,3,1,1,0],[0,1,1,1,4,4,4,4,4,4,1,1,1,0],[0,1,1,4,4,4,4,4,4,4,4,1,1,0],[0,0,0,4,4,4,0,0,4,4,4,0,0,0],[0,0,2,2,2,0,0,0,0,2,2,2,0,0],[0,2,2,2,2,0,0,0,0,2,2,2,2,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        ];

        /*
        -----------------------------------------
        ZADANIE JEST TAKIE:
        -----------------------------------------
        1) zrob petle po 2 wymiarowej talicy "tab"
        2) Kazdą pobraną wartość z tablicy dodawaj do tekstu za pomocą instrukcji:
           tekst += '<div style="background:' + pobranyKolor + '"></div>';
           gdzie pobranyKolor pobieraj z tablicy colors. Indeks koloru pobierzesz z danego miejsca w tablicy tab np:
           tab[0][0] = 0; czyli pobranyKolor = #ffffff
        3) Po zakonczeniu kazdej pętli po tablicy 2 wymiaru, do tekstu dodawaj "<br>"
        4) W rezultacie powinienes otrzymac rysunek
        */


        //-----------------------------------------
        //START
        //-----------------------------------------
        let tekst = '';
        tab.forEach(function(arr){
            arr.forEach(function(el){
            tekst += '<div style="background:' + colors[el] + '"></div>';
          })
          tekst += "<br>";
        });
        //tutaj zrob odpowiednie petle - np. for:




        //tutaj wstawiamy do div wygenerowany html - nie ruszaj poniższej linijki
        document.querySelector('.canvas').innerHTML = tekst;
