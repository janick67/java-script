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
  this.all = {};  //wszystkie rekordy
  this.kolumn = {};
  this.inputs = {};
  this.wygenerowane = 0;
  this.value = {};
}

Distinct.prototype.generujObiekt = function(){
  $.getJSON("/api/wydatki/query",{table: 'wydatki'}) // pobiera dane z serwera
  .done(resp => {
    this.all = resp;
    this.wygenerowane = 1;
    this.dist();
    this.ustaw();

  }).fail(err => console.log(err));
}

Distinct.prototype.pokaz = function()
{
  if (this.wygenerowane === 0) return this.generujObiekt();
  console.log(this.all);
}

Distinct.prototype.ustaw = function(){
  for (const kol in this.kolumn){
    const id = 'add_'+kol;
    const $input = $(`#${id}`)
    $input.addClass(kol);
    $input.attr('list',`${id}_list`);
    const $datalist = $(`<datalist id="${id}_list">`);
    this.kolumn[kol].dist.forEach(el => {
      $option = $(`<option value=${el}>`);
      $datalist.append($option);
    });
    this.kolumn[kol].inputs = $input;
    $input.after($datalist);
    if (kol === 'data'){
      $input.datepicker({ dateFormat: 'yy-mm-dd'});
    }
  }
}

Distinct.prototype.dist = function()
{
  if (this.wygenerowane === 0) return this.generujObiekt();

  Object.getOwnPropertyNames(this.all[0]).forEach(el => {
     this.kolumn[el.toLowerCase()] = {dist:[]};
  })

  //console.log(this.kolumn);
  this.all.forEach(row => {
    for (const el in this.kolumn){
      //console.log(el);
      let dist = this.kolumn[el].dist;
      if (el !== 'id' && el !== 'data' && el !== 'kwota' && el !== 'powiazane' && el !== 'opis'){
        if (row[el] !== null && row[el] !== '')
        {
          if (typeof row[el] !== 'undefined') if (dist.indexOf(row[el]) === -1) dist.push(row[el]);
        }
      }else{
        dist = null;
      }
    }
  });
}

Distinct.prototype.wczytajDoObiektu = function(){
  $('#dodaj input').each((i,e) =>{
    //console.log(i, e, e.classList[0]);
    this.kolumn[e.classList[0]].value = e.value;
  });
}

Distinct.prototype.wyczysc = function(){
  $('#dodaj input').each((i,e) =>{
    this.kolumn[e.classList[0]].value = '';
    e.value = '';
  });
}

Distinct.prototype.czytajIWyslij = function(){
  this.wczytajDoObiektu();
  const obj = {};
  for (const el in this.kolumn){
    const {value} = this.kolumn[el];
    if (typeof value !== 'undefined') obj[el] = value;
  }
  if (this.sprawdz() == 1)
  {
      insert(uri+"api/wydatki",obj)
      .done(res => {
        if (typeof res.id !== 'undefined' && res.id > -1){
          this.wyczysc();
          console.log("Udało się wysłac, id: ", res.id);
          this.toggle();
        }else{
          console.error(res);
        }
      }).error(err => console.error(err))

  }
  else
  console.error("Błędnie wypełniono, popraw błędy i wyślij ponownie")
}

Distinct.prototype.toggle = function(){
  if (distinct.wygenerowane === 0) distinct.generujObiekt();
  $('#dodaj').slideToggle();
}

Distinct.prototype.sprawdz = function(){
  //console.log(this.value);
  //bank

  this.kolumn.bank.rule = {
    title: 'Bank',
    required: true,
    min: 3
  };

  this.kolumn.kwota.rule = {
    title: 'Kwota',
    required: true,
    currency: true
  };

  this.kolumn.data.rule = {
    title: 'Data',
    required: true,
    date: 'ymd'
  };

  this.kolumn.typ.rule = {
    title: 'Typ',
    required: true,
    min: 3
  };

  this.kolumn.typ2.rule = {
    title: 'Typ2',
    required: true,
    min: 3
  };

  this.kolumn.gdzie.rule = {
    title: 'Gdzie',
    required: true,
    min: 3
  };

  this.kolumn.kogo.rule = {
    title: 'Kogo',
    required: true,
    min: 3
  };

  this.kolumn.osoba.rule = {
    title: 'Osoba'
  };

  this.kolumn.powiazane.rule = {
    title: 'Powiązane'
  };

  this.kolumn.opis.rule = {
    title: 'Opis'
  };

let wszystko_ok = 1;
  for (const el in this.kolumn){
    if (this.kolumn[el].inputs.length === 0) continue;
    let {rule} = this.kolumn[el];
    if (typeof rule === 'undefined') continue;
    const aprv = approve.value(this.kolumn[el].value, rule)
    if (aprv.approved) {
      this.kolumn[el].inputs.addClass('good_value');
      this.kolumn[el].inputs.removeClass('bad_value');
    }else{
      wszystko_ok = 0;
      this.kolumn[el].inputs.addClass('bad_value');
      this.kolumn[el].inputs.removeClass('good_value');
    }
  }
  return wszystko_ok;
}


function insert(adres,obiekt){
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
