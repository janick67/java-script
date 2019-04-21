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
  this.el = {}; // zawiera wszystkie elementy html
  this.deklarujElementy()
  this.filtr = null;
  this.wygenerowane = 0;
  wszystkieTabelki[id] = this;
}
//----------------------------------------------------------------------------------KONIEC konstruktora Tabelka------------------------

//-----------------------------------------------------------------------------------------generujHead-------------------------------
Tabelka.prototype.generujHead = function(resp){   // generuje tylko częśc nagłowkową tabeli
  const headers = Object.getOwnPropertyNames(resp[0]);  //pobiera nagłówki kolumn w tabeli
  headers.forEach(el => {
    const th = document.createElement('th');
    th.classList.add(el);
    const span = document.createElement('span');
    span.innerText = el;
    th.appendChild(span);  //tworzy element html
    this.el.trHeader.appendChild(th);             //dodaje ten element na koniec tr#head
  });
}
//--------------------------------------------------------------------------------------KONIEC generujHead---------------------------



Tabelka.prototype.deklarujElementy = function(){
this.el.mainDiv = document.createElement('div');
this.el.mainDiv.setAttribute('id',this.id);
this.el.mainDiv.style.display = 'none'; //zaraz po utworzeniu jest ukrywane

this.el.divBody = document.createElement('div');
this.el.divBody.classList.add('divTable');

this.el.table = document.createElement('table');
this.el.table.setAttribute('summary',this.nazwa);

this.el.thead = document.createElement('thead');

this.el.trHeader = document.createElement('tr');
this.el.trHeader.classList.add('trHeader');

this.el.tbody = document.createElement('tbody');

this.el.paginacja = document.createElement('div')
this.el.paginacja.setAttribute('id','paginacja')
this.el.paginacja.innerHTML = `<button id="prev" type="button" class="btn btn-secondary">Prev</button>
      <input type="text" name="strona" id="strona" value="1" class="form-control align-top"> </input>
      <button id="next" type="button" class="btn btn-secondary">Next</button>
        <select class="custom-select" name="na_strone" id="na_strone">
          <option>5</option>
          <option>10</option>
          <option>25</option>
          <option>50</option>
          <option>100</option>
          <option>500</option>
        </select>`

this.el.paginacja.querySelector('#next')
.onclick = e => aktualna_tabelka.zmienStrone(aktualna_tabelka.strona*1+1)

this.el.paginacja.querySelector('#prev')
.onclick = e => aktualna_tabelka.zmienStrone(aktualna_tabelka.strona*1-1)

this.el.paginacja.querySelector('#na_strone')
.addEventListener('change', e => {
  const it = aktualna_tabelka;
  it.na_strone = e.target.value;
  it.object.limit = it.na_strone;
  it.odswiez();
})

this.el.strona = this.el.paginacja.querySelector('#strona');
this.el.strona.addEventListener('change', e => {
  aktualna_tabelka.zmienStrone(e.target.value);
});

this.el.divBody.addEventListener('mouseout', e => {
  getClossestTag(e.target,'tr').classList.remove('red');
  getClossestTag(e.target,'td').classList.remove('blue')
  });

this.el.divBody.addEventListener('mouseover', e => {
  getClossestTag(e.target,'tr').classList.add('red');
  getClossestTag(e.target,'td').classList.add('blue')
});

this.el.divBody.onclick = e => {
  const id = getClossestClass(e.target, 'divTable').id;
  const kliknieta_tabelka = wszystkieTabelki[id];
  kliknieta_tabelka.filtr.ustaw(e.target);// do filtrowania według kliknietego

  if (e.target.tagName === 'SPAN' && e.target.parentElement.tagName === 'TH'  && e.offsetX > e.target.offsetWidth) {  //sprawdza klikniete bylo na obiekcie czy na prawo od niego jesli na prawo to znaczy ze to byl pseudo element bo jego nie ma w strukturze DOM
          kliknieta_tabelka.sortuj(e.target) //do sortowania według kliknietego
    }
}

this.el.thead.appendChild(this.el.trHeader);
this.el.table.appendChild(this.el.thead);
this.el.table.appendChild(this.el.tbody);
this.el.divBody.appendChild(this.el.table);
this.el.mainDiv.appendChild(this.el.divBody);
this.el.mainDiv.appendChild(this.el.paginacja);
document.querySelector('#tableContainer').appendChild(this.el.mainDiv);
}




// --------------------------------------------------------------------------------------generujBody-------------------------------
Tabelka.prototype.generujBody = function(resp){
  resp.forEach(row =>{
    const tr = document.createElement('tr');
    tr.classList.add('trBody');
    for (const el in row){
      if (el === "data" || el === 'createdDate')  // data jest podawana w długim formacie więc go skracam
        row[el] = formatujDate(row[el]);
      if (row[el] === null || row[el] == 0) row[el] = ''; //nie chce wyświetlac zer i nulli
      const td = document.createElement('td');
      td.classList.add(el);
      td.innerText = row[el];
      tr.appendChild(td);
    };
    this.el.tbody.appendChild(tr);
  });
}
//--------------------------------------------------------------------------------------KONIEC generujBody-----------------------------

//------------------------------------------------------------------------------------------generuj-------------------------------
Tabelka.prototype.generuj = function(){
  if (this.wygenerowane === 1) return;  //jeśli już wygenerowano to nie robi tego kolejny raz
  this.generujObiekt(); // wygenerowanie domyślnego
    console.log('this.adres: ',this.adres,' this.object: ',this.object);
    getJson(this.adres,this.object) // pobiera dane z serwera
    .then(resp => {
      this.generujHead(resp);
      this.generujBody(resp);
      this.wygenerowane = 1;
    })
    .catch(err => {
      console.log(err)
      console.log("Przekierowywuje do logowania");
    //  window.location.href = uri + 'logowanie/index.html';
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
    const sibilings = this.el.mainDiv.parentNode.children;
    Array.prototype.forEach.call(sibilings, el => {  //ukrywa wszystkich braci elementu czyli wszystkie pozostałe divy
      // console.log('index: ',index,'el: ', el,'sib: ',sibilings[el]);
      el.style.display = 'none';
    });
    this.el.mainDiv.style.display = 'block'; // na wszelki wypadek jeszcze sprawia że ta tabelka jest widoczna
    aktualna_tabelka = this;  // przypisuje tabelke do zmiennej żeby poźniej można było się do niej łatwo odwołac
  }
//----------------------------------------------------------------------------------------KONIEC pokaz---------------------------------

//------------------------------------------------------------------------------------------odswiez------------------------------------
Tabelka.prototype.odswiez = function(){ //funkcja odświeża tylko body tabelki, potrzebna np. przy zmianie filtrowania albo przy zmianie strony
  this.generujObiekt();  // generuje obiekt który poźniej jest użyty do zapytania sql
  getJson(this.adres,this.object) //wysyła zapytanie get pod adres z obiektu tabelka i globalny obiekt z ktorego tworzone jest zapytanie sql
  .then(resp => {
    this.el.tbody.innerHTML = ''; //czyści body i wprowadza nowe dane
    this.generujBody(resp);
  })
  .catch(err => {
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

//--------------------------------------------------------------------------------------------init--------------------------------------
Tabelka.prototype.zmienStrone = function(nowaStrona){
  this.strona = nowaStrona
  this.el.strona.value = this.strona;
  this.object.offset = this.na_strone*(this.strona-1);
  this.odswiez();
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
