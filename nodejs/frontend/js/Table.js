//=========================================================================================================================================//
//-----------------------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------------------------Obiekt Tabelka-------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------------------------------------//
//=========================================================================================================================================//

// ----------------------------------------------------------------------------------- Konstruktor Tabelka --------------------
class Table{

  constructor(data){
    this.data = data;
    this.id = this.data.id;
    this.filtr = null;
    this.el = {}; // zawiera wszystkie elementy html
    docReady(()=>{
    this.init();
    })
  }
  //----------------------------------------------------------------------------------KONIEC konstruktora Tabelka------------------------

  //--------------------------------------------------------------------------------------------init--------------------------------------
  // #FUNCTION# ===================================================================
  // Name ..........: init
  // Description ...: inicjacja Filtra
  // Syntax ........: init()
  // Parameter(s): .: -
  // Return Value ..: -
  // Used in .......: Tabelka()(konstruktor)
  // Related .......: createHTML(),dodajFiltr(),show()
  // ==============================================================================
  init(){
    this.createHTML();
    this.filtr = new Filtr(this);
    this.reload();
    this.show();
  }
  //----------------------------------------------------------------------------------------Koniec init------------------------------------

  //-----------------------------------------------------------------------------------------createHTML-------------------------------
  // #FUNCTION# ===================================================================
  // Name ..........: createHTML
  // Description ...: Deklaruje wszystkie elementy HTML
  // Syntax ........: createHTML()
  // Parameter(s): .: -
  // Return Value ..: -
  // Used in .......: init()
  // Related .......: -
  // ==============================================================================

  createHTML(){
    this.el.mainDiv = document.createElement('div');
    this.el.mainDiv.setAttribute('id',this.id);
    this.el.mainDiv.style.display = 'none'; //zaraz po utworzeniu jest ukrywane
    this.el.mainDiv.classList.add('mainDiv');


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
    .onclick = e => aktualna_tabelka.zmienStrone(aktualna_tabelka.data.page*1+1)

    this.el.paginacja.querySelector('#prev')
    .onclick = e => aktualna_tabelka.zmienStrone(aktualna_tabelka.data.page*1-1)

    this.el.paginacja.querySelector('#na_strone')
    .addEventListener('change', e => {
    const it = aktualna_tabelka;
    it.zmienStrone(1);
    it.data.param.limit = e.target.value;
    it.reload();
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
    const id = getClossestClass(e.target, 'mainDiv').getAttribute('id');
    const kliknieta_tabelka = wszystkieTabelki[this.id];
    // console.log('id:', id,'wszystkie: ', wszystkieTabelki[id]);
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

  //--------------------------------------------------------------------------------------KONIEC createHTML---------------------------

  //------------------------------------------------------------------------------------------reload------------------------------------
  // #FUNCTION# ===================================================================
  // Name ..........: reload
  // Description ...: Pobeira dane z backendu, odświeża tabelke, potrzebna np. przy zmianie filtrowania albo przy zmianie strony
  // Syntax ........: reload()
  // Parameter(s): .: -
  // Return Value ..: -
  // Used in .......: zmienStrone(),na_strone,sortuj()
  // Related .......: reloadBody(), reloadHead(), generujObiekt()
  // ==============================================================================

  reload(){ //funkcja odświeża tabelke, potrzebna np. przy zmianie filtrowania albo przy zmianie strony
  this.data.load().then(()=>{
    //console.log('resp = ' , this.data.resp.length);
    if (this.data.resp.length > 0)
    {
      this.reloadBody();
      this.reloadHead();
    }else
    {
      this.el.tbody.innerHTML = ''; //czyści body i wprowadza nowe dane
    }
    })
  }
  //----------------------------------------------------------------------------------------Koniec reload--------------------------------


  //-----------------------------------------------------------------------------------------reloadHead-------------------------------
  // #FUNCTION# ===================================================================
  // Name ..........: reloadHead
  // Description ...: Generuje nagłowek tabeli
  // Syntax ........: reloadHead(resp)
  // Parameter(s): .: resp - object from JSON(from backend)
  // Return Value ..: none
  // Used in .......: reload()
  // Related .......: reloadBody()
  // ==============================================================================
  reloadHead(){
    // console.log(this.data.resp);
    const headers = Object.getOwnPropertyNames(this.data.resp[0]);  //pobiera nagłówki kolumn w tabeli
    if (!this.isChangeHead(headers)) return;
    this.el.trHeader.innerHTML = ''; //czyści body i wprowadza nowe dane
    headers.forEach(el => {
      const th = document.createElement('th');
      th.classList.add(el);
      const span = document.createElement('span');
      span.innerText = el;
      th.appendChild(span);  //tworzy element html
      this.el.trHeader.appendChild(th);             //dodaje ten element na koniec tr#head
    });
  }
  //--------------------------------------------------------------------------------------KONIEC reloadHead---------------------------

  isChangeHead(newHeaders){
    let change = false;
    newHeaders.forEach((el,i) => {
      if (typeof this.el.trHeader.children[i] == 'undefined') change = true; return;
      if (this.el.trHeader.children[i].classList[0] == el) {change = true; return;}
    });
    if (change) return true;
    return false;
  }


  // --------------------------------------------------------------------------------------reloadBody-------------------------------
  // #FUNCTION# ===================================================================
  // Name ..........: reloadBody
  // Description ...: Generuje ciało tabeli
  // Syntax ........: reloadBody(resp)
  // Parameter(s): .: resp - object from JSON(from backend)
  // Return Value ..: none
  // Used in .......:reload()
  // Related .......: reloadHead()
  // ==============================================================================
  reloadBody(){
    this.el.tbody.innerHTML = ''; //czyści body i wprowadza nowe dane
    this.data.resp.forEach(row =>{
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
  //--------------------------------------------------------------------------------------KONIEC reloadBody-----------------------------


  //------------------------------------------------------------------------------------------show-------------------------------------
  // #FUNCTION# ===================================================================
  // Name ..........: show
  // Description ...: Przelacza tabelke na pierwsze miejsce, zeby mozna było na niej pracowac. Tylko jedna tabelka jest widoczna
  // Syntax ........: show()
  // Parameter(s): .: -
  // Return Value ..: -
  // Used in .......: reload(),reloadHead()
  // Related .......: init,aktualna_tabelka
  // ==============================================================================
  show(){                   //tej funkcji używam żeby wybrac tabelke na ktorej bede obecnie pracowal
      const sibilings = this.el.mainDiv.parentNode.children;
      Array.prototype.forEach.call(sibilings, el => {  //ukrywa wszystkich braci elementu czyli wszystkie pozostałe divy
        // console.log('index: ',index,'el: ', el,'sib: ',sibilings[el]);
        el.style.display = 'none';
      });
      this.el.mainDiv.style.display = 'block'; // na wszelki wypadek jeszcze sprawia że ta tabelka jest widoczna
      aktualna_tabelka = this;  // przypisuje tabelke do zmiennej żeby poźniej można było się do niej łatwo odwołac
    }
  //----------------------------------------------------------------------------------------KONIEC show---------------------------------


  //--------------------------------------------------------------------------------------------zmienStrone--------------------------------------
  // #FUNCTION# ===================================================================
  // Name ..........: zmienStrone
  // Description ...: Przelacza strone i wywołuje odswiezenie
  // Syntax ........: zmienStrone(int nowaStrona)
  // Parameter(s): .: nowaStrona - int numer strony na ktroy ma zostac przelaczona tabelka
  // Return Value ..: -
  // Used in .......: paginacja.querySelector('#strona').onclick(),paginacja.querySelector('#next').onclick,paginacja.querySelector('#prev').onclick
  // Related .......: na_strone
  // ==============================================================================
  zmienStrone(nowaStrona){
    this.data.page = nowaStrona;
    this.el.strona.value = nowaStrona;
    this.data.param.offset = this.data.param.limit*(nowaStrona-1);
    this.reload();
  }
  //----------------------------------------------------------------------------------------Koniec zmienStrone------------------------------------


  //-------------------------------------------------------------------------------------------sortuj-------------------------------------
  // #FUNCTION# ===================================================================
  // Name ..........: sortuj
  // Description ...: Przelacza strone i wywołuje odswiezenie
  // Syntax ........: sortuj(obj target)
  // Parameter(s): .: target - komorka wedgług ktorej ma byc posortowana tabelka
  // Return Value ..: -
  // Used in .......: divBody.onclick
  // Related .......: -
  // ==============================================================================
  sortuj(target){
    const {orderby} = this.data.param; //destrukturyzacja obiektu do zwykłej tablicy(pobiera element orderby z obiektu)
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
    this.reload(); // odswieza tabelke tak żeby zastosowac sortowanie
  }
  //----------------------------------------------------------------------------------------Koniec sortuj------------------------------------
}
//=========================================================================================================================================//
//-----------------------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------------------Koniec Obiekt Tabelka------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------------------------------------//
//=========================================================================================================================================//
