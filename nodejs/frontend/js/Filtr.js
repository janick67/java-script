//=========================================================================================================================================//
//-----------------------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------------------------Obiekt Filtr---------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------------------------------------//
//=========================================================================================================================================//

//----------------------------------------------------------------------------------------Konstruktor Filtr--------------------------------
class Filtr{
  constructor(table){      // konstruktor Filtra
    this.table = table;
    this.where = this.table.data.param.where;
    this.tr = document.createElement('tr');
    this.tr.classList.add('trFilter');
    this.wygenerowane = 0;
  }
  //------------------------------------------------------------------------ -----------Koniec konstruktora Filtr ----------------------------

  //----------------------------------------------------------------------------------------generuj------------------------------------------
  generuj(){   // generuje html filtra
    if (this.wygenerowane == 1) return; //jeśli już jest raz wygenerowany to return żeby nie duplikowac
    const allTh = this.table.el.thead.querySelectorAll('TH')// wyszukuje wszystkie elementy th w headzie tabelki
    Array.prototype.forEach.call(allTh,(el) =>{ // i robi po nich petle
      const th = document.createElement('th');
      th.classList.add(el.className);
      const input = document.createElement('input');
      input.setAttribute('type','text');
      input.classList.add(el.className);
      th.appendChild(input);
      this.tr.appendChild(th);
    });
    this.table.el.thead.appendChild(this.tr); //dodaje filtr do nagłówka tabeli
    this.tr.style.display = 'none';
    this.wygenerowane = 1;
    this.tr.addEventListener('change', e => {
      if (e.target.value != '') this.where[e.target.parentElement.className] = e.target.value;  // pobiera rodzica(td) danego inputa i pobiera z niego klase, przypisuje jej w obiekcie wartosc pobrana z inputa
      this.zastosuj(); // stosuje zmiany, co pobiera dane stosowne do nowego filtra
    });
  }
  //------------------------------------------------------------------------------------Koniec generuj--------------------------------------------

  //----------------------------------------------------------------------------------------pokaz----------------------------------------------
  pokaz(){   // funkcja pokazujaca filtr, generuje go jesli jeszcze nie zostal wygenerowany
    if (this.wygenerowane === 0) this.generuj();
    this.tr.style.display = 'table-row';
  }
  //--------------------------------------------------------------------------------------Koniec pokaz-------------------------------------------

  //----------------------------------------------------------------------------------------toggle-----------------------------------------------
  toggle(){      // zmienia stan filtra widoczny/nie widoczny
    if (this.wygenerowane == 0) this.generuj();
    if (this.tr.style.display === 'none') // sprawdza w css widocznośc tr z filtrem
        this.pokaz();
    else
        this.ukryj();
  }
  //--------------------------------------------------------------------------------------Koniec toggle------------------------------------------

  //----------------------------------------------------------------------------------------ukryj-----------------------------------------------
  ukryj(){// ukrywa filtr i dodatkowo czyści go
    this.tr.style.display = 'none';
    this.wyczysc();
  }
  //---------------------------------------------------------------------------------------Koniec ukryj-----------------------------------------

  //----------------------------------------------------------------------------------------wyczysc---------------------------------------------
  wyczysc(){ //czysci wszystkie elementy w obiekcie a nastepnie pobiera dane bez filtrow
    this.where = {};
    this.zastosuj(); // sotsuje nowy pusty filtr, czyli pobiera wszystkie dane
  }
  //----------------------------------------------------------------------------------------Koniec wyczysc--------------------------------------

  //-------------------------------------------------------------------------------------------zastosuj-----------------------------------------
  zastosuj(){// pobiera nowe dane stosownie do ustawionych filtrow w obiekcie
    this.odswiez();
    this.table.zmienStrone(1);
    this.table.reload();  // pobiera nowe dane z serwera stosujac nowy filtr
  }
  //----------------------------------------------------------------------------------------Koniec zastosuj-------------------------------------

  //-------------------------------------------------------------------------------------------ustaw--------------------------------------------
  ustaw(target){ // ustawia filtr na podstawie kliknietego przez uzytkownika elementu
    if (this.wygenerowane === 0) this.generuj();  // generuje filtr jesli jeszcze go nie ma
    if (target.tagName === 'TH'){ // jesli bylo klikniete w naglowek to wyczysc filtr z tego naglowka
      delete this.where[target.classList[0]];
    }
    if (target.tagName === 'TD'){ // klikniete na konkretne dane z tabelki
      if(target.classList[0] === 'powiazane'){  // jesli to powiazane to odnosi sie do wpisow o id do ktorch jest powiazane
        if (target.innerText.length > 0){ //jesli sa wieksze od zera to sie odwoluje
         this.where['id'] = target.innerText;
         this.zastosuj();
         return;
       }else{  // w przeciwnym razie czysci i ukrywa caly filtr
         this.ukryj();
         return;
       }
      }
      this.pokaz(); // jak cos bylo klikniete to zostal ustawiony filtr wiec musi zostac pokazany
      this.where[target.classList[0]] = target.innerText;  //wpisuje do obiektu zawartosc kliknietego elementu
    }
    this.zastosuj(); //stosuje filtr i pobiera według niego nowe dane
  }
  //----------------------------------------------------------------------------------------Koniec ustaw-------------------------------------

  //-------------------------------------------------------------------------------------------odswiez---------------------------------------
  odswiez(){ //przepisuje wszystkie filtry z obiektu do inputow
  let isAllEmpty = true;
  Array.prototype.forEach.call(this.tr.children,(el) => {  //petla po wszystkich td w tr z heada tabelki
    let val = this.where[el.className];
    if (typeof val === 'undefined') val = '';
    if (val !== '') isAllEmpty = false;
    el.querySelector('input').value = val;  // wyszukuje inputa w td
  });
  if (isAllEmpty) this.tr.style.display = 'none';
  }
  //----------------------------------------------------------------------------------------Koniec odswiez----------------------------------
}
//=========================================================================================================================================//
//-----------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------Koniec Obiekt Filtr----------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------------------------------------//
//=========================================================================================================================================//
