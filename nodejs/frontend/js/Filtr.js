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
