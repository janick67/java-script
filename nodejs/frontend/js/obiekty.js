//=========================================================================================================================================//
//-----------------------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------------------------Obiekt Tabelka-------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------------------------------------//
//=========================================================================================================================================//

// ----------------------------------------------------------------------------------- Konstruktor Tabelka --------------------
function Tabelka(id,nazwa)
{
  if (typeof id === 'undefined') id = 'wydatki';  // deklaracja wartosci domyślnej
  if (typeof nazwa === 'undefined') nazwa = id;
  this.na_strone = 5; //ile pozycji na strone
  this.strona = 1; //obecna strona
  this.object = {orderby:[],where:{}}; //objekt w którym przechowywane są wszystkie parametry wysyłane później w zapytaniu sql // od początku tworzę tablice na sortowanie
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
  this.filtr = null;
  this.wygenerowane = 0;
}
//----------------------------------------------------------------------------------KONIEC konstruktora Tabelka------------------------

//-----------------------------------------------------------------------------------------generujHead-------------------------------
Tabelka.prototype.generujHead = function(resp){   // generuje tylko częśc nagłowkową tabeli
  const headers = Object.getOwnPropertyNames(resp[0]);  //pobiera nagłówki kolumn w tabeli
  headers.forEach(el => {
    const $td = $(`<th class="${el}"><span>${el}</span></th>`)   //tworzy element html
    this.$thead.children().append($td);             //dodaje ten element na koniec $tr#head
  });
}
//--------------------------------------------------------------------------------------KONIEC generujHead---------------------------

// --------------------------------------------------------------------------------------generujBody-------------------------------
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
//--------------------------------------------------------------------------------------KONIEC generujBody-----------------------------

//------------------------------------------------------------------------------------------generuj-------------------------------
Tabelka.prototype.generuj = function(){
  if (this.wygenerowane === 1) return;  //jeśli już wygenerowano to nie robi tego kolejny raz
  this.generujObiekt(); // wygenerowanie domyślnego
    $.getJSON(this.adres,this.object) // pobiera dane z serwera
    .done(resp => {
      this.generujHead(resp);
      this.generujBody(resp);
      this.wygenerowane = 1;
    })
    .fail(err => {
      console.log(err)
      window.location.href = uri + '/logowanie/index.html';
    });
    return this;
  };
//--------------------------------------------------------------------------------------KONIEC generuj--------------------------------

//--------------------------------------------------------------------------------------generujObiekt-------------------------------
Tabelka.prototype.generujObiekt = function(obj){ // służy do wygenerowania objektu który jest potem przesyłany w sql
    const obj2 ={       //domyślny obiekt
      table: "wydatki",
      limit: this.na_strone,
      offset: (this.strona-1)*this.na_strone,
    }
    const obj_target = Object.assign({},obj2, this.object, obj); // łączy 3 obiekty, najważniejszy jest podany objekt, później globalny obiekt tabelki i na końcu domyslnie zaszyty w tej funkcji
    for (const el in obj_target.where){
      if (obj_target.where[el] === "") delete obj_target.where[el]; // jeśli jest jakiś pusty element w obiekcie to jest usuwany bo sql później źle filtrował
    };
    this.object = obj_target;   //przypisuje nowo utworzony obiekt do globalnego obiektu
    return obj_target;
  }
//--------------------------------------------------------------------------------------KONIEC generujObiekt--------------------------

//------------------------------------------------------------------------------------------pokaz-------------------------------------
Tabelka.prototype.pokaz = function(){                   //tej funkcji używam żeby wybrac tabelke na ktorej bede obecnie pracowal
    this.$div.siblings().each((index,el) => {  //ukrywa wszystkich braci elementu czyli wszystkie pozostałe divy
      $(el).hide();
    });
    this.$div.show(); // na wszelki wypadek jeszcze sprawia że ta tabelka jest widoczna
    aktualna_tabelka = this;  // przypisuje tabelke do zmiennej żeby poźniej można było się do niej łatwo odwołac
  }
//----------------------------------------------------------------------------------------KONIEC pokaz---------------------------------

//------------------------------------------------------------------------------------------odswiez------------------------------------
Tabelka.prototype.odswiez = function(){ //funkcja odświeża tylko body tabelki, potrzebna np. przy zmianie filtrowania albo przy zmianie strony
  this.generujObiekt();  // generuje obiekt który poźniej jest użyty do zapytania sql
  $.getJSON(this.adres,this.object) //wysyła zapytanie get pod adres z obiektu tabelka i globalny obiekt z ktorego tworzone jest zapytanie sql
  .done(resp => {
    this.$tbody.children().remove(); //czyści body i wprowadza nowe dane
    this.generujBody(resp);
  })
  .fail(err => {
    console.log(err)
  });
}
//----------------------------------------------------------------------------------------Koniec odswiez--------------------------------

//-----------------------------------------------------------------------------------------dodajFiltr----------------------------------
Tabelka.prototype.dodajFiltr = function(){// inicjacja Filtra
  this.filtr = new Filtr(this);
}
//----------------------------------------------------------------------------------------Koniec dodajFiltr-----------------------------

//--------------------------------------------------------------------------------------------init--------------------------------------
Tabelka.prototype.init = function(){
  this.dodajFiltr();
  this.generuj();
  this.pokaz();
}
//----------------------------------------------------------------------------------------Koniec init------------------------------------

//-------------------------------------------------------------------------------------------sortuj-------------------------------------
Tabelka.prototype.sortuj = function(target){
  const {orderby} = this.object; //destrukturyzacja obiektu do zwykłej tablicy(pobiera element orderby z obiektu)
  let klasa = target.parentElement.className;               //klasa nadrzędnego elementu(th) np. bank, ID
  let wystapienie = orderby.indexOf(klasa);  //sprawdza czy w tablicy jest już pojedyncze wystapienie
  let wystapieniedesc = orderby.indexOf('!'+klasa);  //sprawdza czy w tablicy jest juz wystapienie desc
  if (wystapienie > -1 || wystapieniedesc >  -1)  //    // jeśli występuje już desc lub normalne  -- z wykrzyknikiem to jest desc
  {
    if ( wystapieniedesc > -1){ // wystapienie z ! czyli desc
      orderby.splice(wystapieniedesc,1); // usuwa element z ! z tablicy z obiektu
      target.classList.remove('up')   // usuwa pozostałe klasy
      target.classList.remove('down')  // dwie strzalki
    } else{
      orderby[wystapienie] = '!'+klasa;  // jesli juz jest normalne wystapienie to zamienia je na desc
      target.classList.add('down'); // dodaje klase po to zeby byla strzalka w dol
      target.classList.remove('up')
    }
  }else{
    orderby.push(klasa); // dodaje kolumne po której ma byc sortowana tabelka
    target.classList.add('up');// dodaje klase po to zeby byla strzalka w gore
    target.classList.remove('down')
  }
  this.odswiez(); // odswieza tabelke tak żeby zastosowac sortowanie
}
//----------------------------------------------------------------------------------------Koniec sortuj------------------------------------

//=========================================================================================================================================//
//-----------------------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------------------Koniec Obiekt Tabelka------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------------------------------------//
//=========================================================================================================================================//


//=========================================================================================================================================//
//-----------------------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------------------------Obiekt Filtr---------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------------------------------------//
//=========================================================================================================================================//

//----------------------------------------------------------------------------------------Konstruktor Filtr--------------------------------
function Filtr(tabelka){      // konstruktor Filtra
    this.tabelka = tabelka;
    this.$tr = $(`<tr class="trFilter"></tr>`);
    this.wygenerowane = 0;
    this.object = {where:{}}; // w tym obiekcie są wartości wszystkich kolumn wraz z ustawionymi obecnie filtrami
}
//-----------------------------------------------------------------------------------Koniec konstruktora Filtr ----------------------------

//----------------------------------------------------------------------------------------generuj------------------------------------------
Filtr.prototype.generuj = function(){   // generuje html filtra
  if (this.wygenerowane == 1) return; //jeśli już jest raz wygenerowany to return żeby nie duplikowac
  $(this.tabelka.$thead[0].querySelectorAll('TH'))// wyszukuje wszystkie elementy th w headzie tabelki
  .each((i,el) => { // i robi po nich petle
    const $th = $(`<th class="${el.className}"></th>`);
    const $input = $(`<input type="text" class="${el.className}"></input>`);
    this.object.where[el.className] = ''; // towrzy obiekt ktory bedzie odpowaidal zawartoscia inputa czyli na poczatku kazdy input bedzie pusty
    $th.append($input);
    this.$tr.append($th);
  });
  this.tabelka.$thead.append(this.$tr); //dodaje filtr do nagłówka tabeli
  this.$tr.hide();
  this.wygenerowane = 1;
  this.$tr.on('change', e => {
    this.object.where[e.target.parentElement.className] = e.target.value;  // pobiera rodzica(td) danego inputa i pobiera z niego klase, przypisuje jej w obiekcie wartosc pobrana z inputa
    this.zastosuj(); // stosuje zmiany, co pobiera dane stosowne do nowego filtra
  });
}
//------------------------------------------------------------------------------------Koniec generuj--------------------------------------------

//----------------------------------------------------------------------------------------pokaz----------------------------------------------
Filtr.prototype.pokaz = function(){   // funkcja pokazujaca filtr, generuje go jesli jeszcze nie zostal wygenerowany
  if (this.wygenerowane === 0) this.generuj();
  this.$tr.show();
}
//--------------------------------------------------------------------------------------Koniec pokaz-------------------------------------------

//----------------------------------------------------------------------------------------toggle-----------------------------------------------
Filtr.prototype.toggle = function(){      // zmienia stan filtra widoczny/nie widoczny
  if (this.wygenerowane == 0) this.generuj();
  if (this.$tr.css('display') === 'none') // sprawdza w css widocznośc tr z filtrem
      this.pokaz();
  else
      this.ukryj();
}
//--------------------------------------------------------------------------------------Koniec toggle------------------------------------------

//----------------------------------------------------------------------------------------ukryj-----------------------------------------------
Filtr.prototype.ukryj = function(){// ukrywa filtr i dodatkowo czyści go
  this.$tr.hide();
  this.wyczysc();
}
//---------------------------------------------------------------------------------------Koniec ukryj-----------------------------------------

//----------------------------------------------------------------------------------------wyczysc---------------------------------------------
Filtr.prototype.wyczysc = function(){ //czysci wszystkie elementy w obiekcie a nastepnie pobiera dane bez filtrow
  for (el in this.object.where)
  {
    this.object.where[el] = '';
  }
  this.zastosuj(); // sotsuje nowy pusty filtr, czyli pobiera wszystkie dane
}
//----------------------------------------------------------------------------------------Koniec wyczysc--------------------------------------

//-------------------------------------------------------------------------------------------zastosuj-----------------------------------------
Filtr.prototype.zastosuj = function(){// pobiera nowe dane stosownie do ustawionych filtrow w obiekcie
  this.odswiez(); // przepisuje obiekt do inputow
  const obj = Object.assign({},this.object,{offset: 0});  // tworzy nowy obiekt i wraca na pierwsza strone skoro zmieniło się filtrowanie
  this.tabelka.generujObiekt(obj); // generuje obiekt ktory bedzie pozniej przekazany do sql
  this.tabelka.odswiez()  // pobiera nowe dane z serwera stosujac nowy filtr
}
//----------------------------------------------------------------------------------------Koniec zastosuj-------------------------------------

//-------------------------------------------------------------------------------------------ustaw--------------------------------------------
Filtr.prototype.ustaw = function(target){ // ustawia filtr na podstawie kliknietego przez uzytkownika elementu
  if (this.wygenerowane === 0) this.generuj();  // generuje filtr jesli jeszcze go nie ma
  if (target.tagName === 'TH'){ // jesli bylo klikniete w naglowek to wyczysc filtr z tego naglowka
    this.object.where[target.classList[0]] = '';
  }
  if (target.tagName === 'TD'){ // klikniete na konkretne dane z tabelki
    if(target.classList[0] === 'powiazane'){  // jesli to powiazane to odnosi sie do wpisow o id do ktorch jest powiazane
      if (target.innerText.length > 0){ //jesli sa wieksze od zera to sie odwoluje
       this.object.where['id'] = target.innerText;
       this.zastosuj();
       return;
     }else{  // w przeciwnym razie czysci i ukrywa caly filtr
       this.ukryj();
       return;
     }
    }
    this.pokaz(); // jak cos bylo klikniete to zostal ustawiony filtr wiec musi zostac pokazany
    this.object.where[target.classList[0]] = target.innerText;  //wpisuje do obiektu zawartosc kliknietego elementu
  }
  this.zastosuj(); //stosuje filtr i pobiera według niego nowe dane
}
//----------------------------------------------------------------------------------------Koniec ustaw-------------------------------------

//-------------------------------------------------------------------------------------------odswiez---------------------------------------
Filtr.prototype.odswiez = function(){ //przepisuje wszystkie filtry z obiektu do inputow
$(this.$tr.children()).each((i,el) =>{  //petla po wszystkich td w tr z heada tabelki
  val = this.object.where[el.className];
  if (typeof val === 'undefined') val = '';
  el.querySelector('input').value = val;  // wyszukuje inputa w td
});
}
//----------------------------------------------------------------------------------------Koniec odswiez----------------------------------

//=========================================================================================================================================//
//-----------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------Koniec Obiekt Filtr----------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------------------------------------//
//=========================================================================================================================================//

function Distinct(){
  this.all = {};  //wszystkie rekordy prosto po pobraniu z bazy
  this.kolumn = {}; //w obiekcie są zapisane inputy, ich wartości, sugerowane wartosci w inputach
  this.wygenerowane = 0;
}


Distinct.prototype.init = function(){
  $.getJSON("/api/wydatki/query",{table: 'wydatki'}) // pobiera dane z serwera
  .done(resp => {
    this.all = resp;  //odpowiedz jest w formie tablicy obiektów(nazwa kolumny: wartośc)
    this.wygenerowane = 1;
    this.generujProponowane();  //generuje i zapisuje do obiektu this.kolumn[el].proponowane
    this.przygotujInputy(); //dodaje klasy, dataliste z podpowiedziami i datapickera dla inputa data
  }).fail(err => console.log(err));
}

Distinct.prototype.przygotujInputy = function(){ //dodaje klasy, dataliste z podpowiedziami i tworzy datapickera
  for (const kol in this.kolumn){
    const id = 'add_'+kol; // kol to nazwa kolumny z bazy pisana małymi literami
    const $input = $(`#${id}`)
    $input.addClass(kol);   //dodaje klasy do inputów o takiej wartości jak nazwa kolumny
    $input.attr('list',`${id}_list`); //podpina datalist pod inputa tak żeby podpowiadały się wartości
    const $datalist = $(`<datalist id="${id}_list">`); //tworzy dataliste do każdego inputa z podpowiedziami
    this.kolumn[kol].proponowane.forEach(el => {  //tworzy wartości do datalisty i dodaje je do niej
      $option = $(`<option value=${el}>`);
      $datalist.append($option);
    });
    this.kolumn[kol].input = $input; //dodaje inputa do obiektu w którym są jeszcze wartości i domyślne wartości
    $input.after($datalist);  //dodaje datalistę po inpucie w htmlu
    if (kol === 'data') $input.datepicker({ dateFormat: 'yy-mm-dd'}) // dla daty dodaję jeszcze okienko modalne pozwalające wybrac date
  }
}

Distinct.prototype.generujProponowane = function(){ //robi pętle po wszystkich rekordach z bazy i robi tak jakby distincta
  if (this.wygenerowane === 0) return this.generujObiekt(); // jeśli obiekt jeszcze nie jest wygenerowany to wygeneruj
  Object.getOwnPropertyNames(this.all[0]).forEach(el => { // wypełnia nazwami kolumn pisanymi małymi literami obiekt kolumn w którym później będą wszystkie dane odnosnie inputów
     this.kolumn[el.toLowerCase()] = {proponowane:[]};
  })
  this.all.forEach(row => { //pętla po wszystkich zwróconych rekordach z bazy
    for (const el in this.kolumn){  //w każdym rekordzie pętla po wszyskich jego kolumnach
      let {proponowane} = this.kolumn[el];  // destrukturyzacja
      if (el !== 'id' && el !== 'data' && el !== 'kwota' && el !== 'powiazane' && el !== 'opis'){ // dla tych pól nie są podpowiadane żadne wartości
        if (typeof row[el] !== 'undefined' && row[el] !== null && row[el] !== '')  //dla pustych wartości nie robimy nic
            if (proponowane.indexOf(row[el]) === -1) proponowane.push(row[el]);// jeśli nie ma jeszcze takiego rekordu to wrzucamy na koniec tablicy
      }else{
        proponowane = null; // jeśli to jest jedna z wyżej wymienionych kolumn i nie potrzebuje podpowiedzi to przypisujemy nulla
  }}});}

Distinct.prototype.wyczysc = function(){//czysci wszystkie inputy ich klasy i obiekt
  $('#dodaj input').each((i,el) =>{
    const kol = this.kolumn[el.classList[0]]; // upraszczam zapis
    kol.value = ''; //zeruje wartośc wpisana do obiektu
    el.value = '';  //zeruje wartosc wpisana do inputa
    $('#dodaj span.error').remove(); //usuwa wszystkie stare komunikaty o błędach
    kol.input.removeClass('bad_value'); //usuwam klasy, ktore zmienialy wyglad inpotow, skoro czyszcze to juz takie oznaczenia nie sa potrzebne
    kol.input.removeClass('good_value');
  });
}

Distinct.prototype.czytajIWyslij = function(){ // wczytuje dane z imputów, wysyła do walidacji i później je wysyła i obsługuje odpowiedź
  $('#dodaj input').each((i,e) =>{
    this.kolumn[e.classList[0]].value = e.value;  //pętla po wszystkich inputach, zczytuje ich wartości i wrzuca do obiektu kolumn
  });
  const obj = {}; // obiekt w którym będą wartości wszystkich pól i po walidacji zostanie wysłany do serwera
  for (const el in this.kolumn){ //pętla po wszystkich kolumnach
    const {value} = this.kolumn[el]; // destrukturyzacja
    if (typeof value !== 'undefined') obj[el] = value; //przypisanie wartości z inputa do obiektu
  }
  if (this.sprawdz(obj) == 1){  // walidacja przed wysłaniem na serwer
      insert(uri+"api/wydatki",obj) //jeśli jest ok to wysyłam
      .done(res => { //sprawdzam odpowiedz bo to że jest to jeszcze nie znaczy że jest dobra
        if (typeof res.id !== 'undefined' && res.id > -1){  //jeśli serwer zwrócił nam id nowo dodanego rekordu to jest ok
          location.reload();
          this.wyczysc(); //czyszczę bo jak już dodane to nie trzeba mi już tych danych
        }else{console.error(res);}
      }).error(err => console.error(err))
  }else{
  console.error("Błędnie wypełniono, popraw błędy i wyślij ponownie!")}
}

Distinct.prototype.toggle = function(){ // pokazuje i chowa diva z wprowadzaniem
  if (distinct.wygenerowane === 0) distinct.init();
  $('#dodaj').slideToggle();
}

Distinct.prototype.sprawdz = function(obj){ // wysyła dane do walidacji i wyswietal poźniej stosowne informacje o błędzie, zwraca 1 jeśli wszystko jest ok i 0 gdy coś się nie powiodło
  const err = sprawdz(obj);// waliduje dane zwraca 1 gdy ok i 0 gdy nie
  $('#dodaj span.error').remove(); //usuwa wszystkie stare komunikaty o błędach
  for (const el in this.kolumn){ // pętla po wszystkich kolumnach
    const {input} = this.kolumn[el];
    if (input.length === 0) continue;  // jesli nie zawiera inputow to nie ma co sprawdzac
    if (typeof err[el] === 'undefined') { // jeśli nie ma błędow dla tego elementu to znaczy ze wszystko jest ok
      input.addClass('good_value'); //ustawia flagę informującą o powodzeniu i usuwa ewentualną o nie powodzeniu
      input.removeClass('bad_value');
    }else{
      input.after($(`<span class="error">${err[el][0]}</span>`)); // dodaje spana po prawej stronie inputaa informującą o błędzie i jego treści
      input.addClass('bad_value'); //usuwa dobrą dodaje klase informujaca o bledzie
      input.removeClass('good_value');
    }
  }
  if (Object.keys(err).length > 0) return 0; //jeśli nie ma żadnych błędow to zwraca 1 i można wtedy wyslac dane
  return 1;
}

function rules(){ // funkcja konfigurująca, ustawiam tu wymagania przy walidacji inputow i ewentualne informacje przy bledach, zwraca obiekt zawierający wszystkie regoly pogrupowane na kolumny
  const m = {required:'Pole {title} jest wymagane.',
  min:'Wymagane przynajmniej {min} znaki.',
  cur:'Podaj prawidłową wartosc',
  data:'Podaj prawidłową date'};
  const rules = {}; //obiekt ktory bedzie zawierał wszystkie bledy
  rules.bank = {title: 'Bank',required:{required:true,message:m.required},min:{min:3,message:m.min}};
  rules.kwota = {title: 'Kwota',required:{required:true,message:m.required},currency:{currency:true,message:m.cur}};
  rules.data = {title: 'Data',required:{required:true,message:m.required},date:{format:'ymd',message:m.data},min:{min:3,message:m.min}};
  rules.typ = {title: 'Typ',required:{required:true,message:m.required},min:{min:3,message:m.min}};
  rules.typ2 = {title: 'Typ2',required:{required:true,message:m.required},min:{min:3,message:m.min}};
  rules.gdzie = {title: 'Gdzie',required:{required:true,message:m.required},min:{min:3,message:m.min}};
  rules.kogo = {title: 'Kogo',required:{required:true,message:m.required},min:{min:3,message:m.min}};
  rules.osoba = {title: 'Osoba'};
  rules.powiazane = {title: 'Powiązane'};
  rules.opis = {title: 'Opis'};
  return rules; // zwraca obiekt zawierający wszystkie regoly pogrupowane na kolumny
}

function sprawdz(dane){ // funkcja walidujaca dane, zwraca tablice z ewentualnymi bledami
  const rule = rules();
  const errors = {};// w tym obiekcie beda zapisane wszystkie bledy ktore wystapia
  for (const kol in rule){
    if (typeof rule[kol] === 'undefined') continue; // jeśli nie znalazl żadnej reguły to nie ma co sprawdzac wiec pomija
    const aprv = approve.value(dane[kol], rule[kol]) //funkcja sprawdzajaca dane, zwraca obiekt
    if (!aprv.approved){ //zwracany obiekt zawiera approved ktore jest rowne 1 jesli wszystko jest ok i 0 gdy cos nie przeszlo testow
      errors[kol] = aprv.errors; // przytpisuje tablice błedow do konkretnej kolumny
    }}
  return errors;//zwraca obiekt z elementami kolumn a w nich tablice z błedami
}

function insert(adres,obiekt){// wysyła dane postem, w obiekcie sa dane ktore zostana wyslane do sql
return $.ajax({
  method: "POST",
  url: adres,
  data: JSON.stringify(obiekt),
  contentType : 'application/json'
});}

function formatujDate(date){
const data = new Date(date);
return leadingZero(data.getFullYear()) + "-" + leadingZero(data.getMonth()+1) + "-" + leadingZero(data.getDate());
}

function leadingZero(i) {
  return (i < 10)? '0'+i : i;
}
