// ---------------------------------------------------------------------- Konstruktor Tabelka ---------------
function Tabelka(id,nazwa)
{
  if (typeof id === 'undefined') id = 'wydatki';  // deklaracja wartosci domyślnej
  if (typeof nazwa === 'undefined') nazwa = id;
  this.na_strone = 5; //ile pozycji na strone
  this.strona = 1; //obecna strona
  this.object = {}; //objekt w którym przechowywane są wszystkie parametry wysyłane później w zapytaniu sql
  this.adres = uri; //adres z którego połączył się ktoś
  this.nazwa = nazwa;
  this.sql_table = 'wydatki';
  this.id = id;
  this.$div = $(`<div class="divTable" id="${this.id}"></div>`); //zewnętrzny div w którym znajduje sie cała tabelka
  $('div#body').append(this.$div);
  this.$div.data('obj',this); // w data jest trzymany odnośnik do tego objektu
  this.$tabela = $(`<table summary="${this.nazwa}"></table>`);
  this.$div.append(this.$tabela);
  this.$div.hide(); //zaraz po utworzeniu jest ukrywane
  this.$thead = $('<thead class="thead"><tr class="trHeader"></tr></thead>');
  this.$tabela.append(this.$thead);
  this.$tbody = $('<tbody class="tbody"></tbody>');
  this.$tabela.append(this.$tbody);
  this.filtr = null;  //
  this.wygenerowane = 0;
}
//-------------------------------------------------------------------------------
Tabelka.prototype.generujHead = function(resp){   // generuje tylko częśc nagłowkową tabeli
  const headers = Object.getOwnPropertyNames(resp[0]);  //pobiera nagłówki kolumn w tabeli
  headers.forEach(el => {
    const $td = $(`<th class="${el}">${el}</th>`)   //tworzy element html
    this.$thead.children().append($td);             //dodaje ten element na koniec $tr#head
  });
}

Tabelka.prototype.generujBody = function(resp){
  resp.forEach(row =>{
    const $tr = $('<tr class=trBody></tr>');
    for (const el in row){
      if (el === "data")  // data jest podawana w długim formacie więc go skracam
      {
        row[el] = formatujDate(row[el]);
      }
      if (row[el] === null || row[el] == 0) row[el] = ''; //nie chce zer i nulli
      const $td = $(`<td class="${el}">${row[el]}</td>`)
      $tr.append($td);
    };
    this.$tbody.append($tr);
  });
}


Tabelka.prototype.generuj = function(){
  if (this.wygenerowane === 1) return;  //jeśli już wygenerowano to nie robi tego kolejny raz
  this.generuj_obiekt(); // wygenerowanie domyślnego
    $.getJSON(this.adres,this.object) // pobiera dane z serwera
    .done(resp => {
      this.generujHead(resp);
      this.generujBody(resp);
      this.wygenerowane = 1;
    })
    .fail(err => {
      console.log(err)
    });
    return this;
  };

Tabelka.prototype.generuj_obiekt = function(obj){ // służy do wygenerowania objektu który jest potem przesyłany w sql
    const obj2 ={       //domyślny obiekt
      table: "wydatki",
      limit: this.na_strone,
      offset: (this.strona-1)*this.na_strone
    }
    const obj_target = Object.assign({},obj2, this.object, obj); // łączy 3 obiekty, najważniejszy jest podany objekt, później globalny obiekt tabelki i na końcu domyslnie zaszyty w tej funkcji
    for (const el in obj_target){
      if (obj_target[el] === "") delete obj_target[el]; // jeśli jest jakiś pusty element w obiekcie to jest usuwany bo sql później źle filtrował
    };
    this.object = obj_target;   //przypisuje nowo utworzony obiekt do globalnego obiektu
    return obj_target;
  }

//------------------------------------------------------------------------------------------
Tabelka.prototype.pokaz = function(){                   //tej funkcji używam żeby wybrac tabelke na ktorej bede obecnie pracowal
    this.$div.siblings().each((index,el) => {  //ukrywa wszystkich braci elementu czyli wszystkie pozostałe divy
      $(el).hide();
    });
    this.$div.show(); // na wszelki wypadek jeszcze sprawia że ta tabelka jest widoczna
    aktualna_tabelka = this;  // przypisuje tabelke do zmiennej żeby poźniej można było się do niej łatwo odwołac
  }
//-------------------------------------------------------------------------------------------

Tabelka.prototype.odswiez = function(){ //funkcja odświeża tylko body tabelki, potrzebna np. przy zmianie filtrowania albo przy zmianie strony
  this.generuj_obiekt();  // generuje obiekt który poźniej jest użyty do zapytania sql
  $.getJSON(this.adres,this.object) //wysyła zapytanie get pod adres z obiektu tabelka i globalny obiekt z ktorego tworzone jest zapytanie sql
  .done(resp => {
    this.$tbody.children().remove(); //czyści body i wprowadza nowe dane
    this.generujBody(resp);
  })
  .fail(err => {
    console.log(err)
  });
}

//--------------------------------------------------------------------------------------------

Tabelka.prototype.dodaj_filtr = function(){// inicjacja Filtra
  this.filtr = new Filtr(this);
}

Tabelka.prototype.init = function(){
  this.dodaj_filtr();
  this.generuj();
  this.pokaz();
}

// ----------------------------------------------------------------------------------------------

function Filtr(tabelka){      // konstruktor Filtra
    this.tabelka = tabelka;
    this.$tr = $(`<tr class="trFilter"></tr>`);
    this.wygenerowane = 0;
    this.object = {}; // w tym obiekcie są wartości wszystkich kolumn wraz z ustawionymi obecnie filtrami
}

Filtr.prototype.generuj = function(){   // generuje html filtra
  if (this.wygenerowane == 1) return; //jeśli już jest raz wygenerowany to return żeby nie duplikowac
  $(this.tabelka.$thead[0].querySelectorAll('TH'))// wyszukuje wszystkie elementy th w headzie tabelki
  .each((i,el) => { // i robi po nich petle
    const $th = $(`<th class="${el.className}"></th>`);
    const $input = $(`<input type="text" class="${el.className}"></input>`);
    this.object[el.className] = ''; // towrzy obiekt ktory bedzie odpowaidal zawartoscia inputa czyli na poczatku kazdy input bedzie pusty
    $th.append($input);
    this.$tr.append($th);
  });
  this.tabelka.$thead.append(this.$tr); //dodaje filtr do nagłówka tabeli
  this.$tr.hide();
  this.wygenerowane = 1;
  this.$tr.on('change', e => {
    this.object[e.target.parentElement.className] = e.target.value;  // pobiera rodzica(td) danego inputa i pobiera z niego klase, przypisuje jej w obiekcie wartosc pobrana z inputa
    this.zastosuj(); // stosuje zmiany, co pobiera dane stosowne do nowego filtra
  });
}

Filtr.prototype.pokaz = function(){   // funkcja pokazujaca filtr, generuje go jesli jeszcze nie zostal wygenerowany
  if (this.wygenerowane === 0) this.generuj();
  this.$tr.show();
}

Filtr.prototype.toggle = function(){      // zmienia stan filtra widoczny/nie widoczny
  if (this.wygenerowane == 0) this.generuj();
  if (this.$tr.css('display') === 'none') // sprawdza w css widocznośc tr z filtrem
      this.pokaz();
  else
      this.ukryj();
}

Filtr.prototype.ukryj = function(){// ukrywa filtr i dodatkowo czyści go
  this.$tr.hide();
  this.wyczysc();
}

Filtr.prototype.wyczysc = function(){ //czysci wszystkie elementy w obiekcie a nastepnie pobiera dane bez filtrow
  for (el in this.object)
  {
    this.object[el] = '';
  }
  this.zastosuj(); // sotsuje nowy pusty filtr, czyli pobiera wszystkie dane
}

Filtr.prototype.zastosuj = function(){// pobiera nowe dane stosownie do ustawionych filtrow w obiekcie
  this.odswiez(); // przepisuje obiekt do inputow
  const obj = Object.assign({},this.object,{offset: 0});  // tworzy nowy obiekt i wraca na pierwsza strone skoro zmieniło się filtrowanie
  this.tabelka.generuj_obiekt(obj); // generuje obiekt ktory bedzie pozniej przekazany do sql
  this.tabelka.odswiez()  // pobiera nowe dane z serwera stosujac nowy filtr
}

Filtr.prototype.ustaw = function(target){ // ustawia filtr na podstawie kliknietego przez uzytkownika elementu
  if (this.wygenerowane === 0) this.generuj();  // generuje filtr jesli jeszcze go nie ma
  if (target.tagName === 'TH'){ // jesli bylo klikniete w naglowek to wyczysc filtr z tego naglowka
    this.object[target.classList[0]] = "";
  }
  if (target.tagName === 'TD'){ // klikniete na konkretne dane z tabelki
    if(target.classList[0] === 'Powiązane'){  // jesli to powiazane to odnosi sie do wpisow o id do ktorch jest powiazane
      if (target.innerText.length > 0){ //jesli sa wieksze od zera to sie odwoluje
       this.object['ID'] = target.innerText;
     }else{  // w przeciwnym razie czysci i ukrywa caly filtr
       this.ukryj();
       return;
     }
    }
    this.pokaz(); // jak cos bylo klikniete to zostal ustawiony filtr wiec musi zostac pokazany
    this.object[target.classList[0]] = target.innerText;  //wpisuje do obiektu zawartosc kliknietego elementu
  }
  this.zastosuj(); //stosuje filtr i pobiera według niego nowe dane
}

Filtr.prototype.odswiez = function(){ //przepisuje wszystkie filtry z obiektu do inputow
$(this.$tr.children()).each((i,el) =>{  //petla po wszystkich td w tr z heada tabelki
  el.querySelector('input').value = this.object[el.className];  // wyszukuje inputa w td
});
}

function formatujDate(date){
const data = new Date(date);
return leadingZero(data.getFullYear()) + "-" + leadingZero(data.getMonth()+1) + "-" + leadingZero(data.getDate());
}

function leadingZero(i) {
  return (i < 10)? '0'+i : i;
}
