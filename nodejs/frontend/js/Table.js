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
    this.columnsReady = false;
    this.columnsToShow = [];
    this.el = {}; // zawiera wszystkie elementy html
    this.getColumns();
   // let load = ()=>{if (typeof this.getColumns setTimeout(alertFunc, 3000)};
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
    this.createEditTableHTML();
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
    this.el.editButton = document.createElement('div');
    this.el.editButton.setAttribute('class','editButton');
    this.el.editButton.setAttribute('title','Edytuj układ tabelki');

    this.el.table.appendChild(this.el.editButton);
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
    const kliknieta_tabelka = allElement[this.id].table;
    // console.log('id:', id,'wszystkie: ', allElement[id].table);
    kliknieta_tabelka.filtr.ustaw(e.target);// do filtrowania według kliknietego

    if (e.target.tagName === 'SPAN' && e.target.parentElement.tagName === 'TH'  && e.offsetX > e.target.offsetWidth) {  //sprawdza klikniete bylo na obiekcie czy na prawo od niego jesli na prawo to znaczy ze to byl pseudo element bo jego nie ma w strukturze DOM
            kliknieta_tabelka.sortuj(e.target) //do sortowania według kliknietego
      }
    }

    this.el.editButton.onclick = e =>{
      this.createEditTableHTML();
      $('#modal_edit_table').modal();
    }

    document.querySelector('#et_submit').onclick = e =>{
      this.columnsToShow = this.readEditTable();
      this.saveEditTable();
      this.reload();
      $('#modal_edit_table').modal('hide');
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

  getColumns(){
    getJson(uri + "api/columns")
    .then(resp => {
      if (resp.length > 0){
        this.columnsReady = true;
        let obj =  JSON.parse(resp[resp.length-1].col_json);
        obj.forEach(el => {     
          let element = {};
          element.param = el;
          element.el = {};
          this.columnsToShow.push(element);
        })
      }else{
        this.columnsToShow =  [{param:{name:'Id',show:true,fieldInSql:'id',priority:0},el:{}},
        {param:{name:'Bank',show:true,fieldInSql:'bank',priority:3},el:{}},
        {param:{name:'Kwota',show:true,fieldInSql:'kwota',priority:1},el:{}},
        {param:{name:'Data',show:true,fieldInSql:'data',priority:2},el:{}},
        {param:{name:'Typ',show:true,fieldInSql:'typ',priority:2},el:{}},
        {param:{name:'Typ2',show:true,fieldInSql:'typ2',priority:3},el:{}},
        {param:{name:'Gdzie',show:true,fieldInSql:'gdzie',priority:4},el:{}},
        {param:{name:'Kogo',show:true,fieldInSql:'kogo',priority:4},el:{}},
        {param:{name:'Osoba',show:true,fieldInSql:'osoba',priority:0},el:{}},
        {param:{name:'Powiązane',show:true,fieldInSql:'powiazane',priority:0},el:{}},
        {param:{name:'Opis',show:true,fieldInSql:'opis',priority:4},el:{}}]
        //{name:'Data wpisu',fieldInSql:'createdDate',priority:0},
        //{name:'Użytkownik',fieldInSql:'userId',priority:0}];
      }
    }).catch(err => {console.error(err);})
  }

  createEditTableHTML(){
    let et_template = document.querySelector("template#editTableCard").content.children[0];
    let parent = document.querySelector('div#editTableList');
    parent.innerHTML = '';      //Czyścimy parent node i zostawiamy tylko template żeby za każdym razem był od nowa generowany
    //console.log(this.columnsToShow);
    this.columnsToShow.forEach((element)=>{
      let el = element.param;
      let newelement = {};
      let globalCard = et_template.cloneNode(true);
      globalCard.id = el.fieldInSql;
      globalCard.querySelector('.et_headerName').innerText = el.name;
      globalCard.innerHTML = globalCard.innerHTML.replace(/{{columnsToShow.et_fieldInSql}}/g,el.fieldInSql)
      newelement.inputField = globalCard.querySelector('.inputField');
      newelement.inputField.value = el.fieldInSql;
      newelement.inputPriority = globalCard.querySelector('.inputPriority');
      newelement.inputPriority.value = el.priority;
      newelement.inputName = globalCard.querySelector('.inputName');
      newelement.inputName.value = el.name;
      newelement.inputShow = globalCard.querySelector('.inputShow');
      newelement.inputShow.classList.add(el.show?'show':'hide');
      globalCard.style.display ='';
      globalCard.querySelector('span.inputShow').onclick = this.et_show;
      //console.log(newelement.innerHTML);
      //console.log(et_template.parentElement,newelement);
      parent.append(globalCard);
      newelement[globalCard] = globalCard;
      element.el = newelement;
    })
    //console.log(this.columnsToShow)

  new Sortable(document.querySelector('#editTableList'), {
    handle: '.handle', // handle's class
    animation: 500
});

  }

  et_show = e =>{
    e.stopPropagation();
    let list = e.target.classList;
    if (list.contains('show')) 
    {
      list.add('hide');
      list.remove('show');
    }else{
      list.remove('hide');
      list.add('show');
    }
  }

  readEditTableHTML()
  {
    let tab = [];
    let el = document.querySelector('div#editTableList').children;
    for (let i = 1; i < el.length; i++){ // od 1 żeby pominąć template
     tab.push(this.columnsToShow[this.findInTab(el[i].id)]);
    }
     
    return tab;
  }
  
  findInTab(value){
    let tab = this.columnsToShow;
    for (let i = 0; i < tab.length; i++){
      if (tab[i].param['fieldInSql'] == value) return i;
    }
  }

  readEditTable(){
    this.columnsToShow.forEach(element =>{
      let el = element.param;
     // console.log(element.el.inputShow,element.el.inputShow.classList.contains('show'));
      
      el.show = element.el.inputShow.classList.contains('show');
      el.name = element.el.inputName.value
      el.priority = element.el.inputPriority.value
      el.fieldInSql = element.el.inputField.value
    })

    return this.readEditTableHTML();

  }

  saveEditTable(){
    let tab = {name:'szablon',columns:[]}
    this.columnsToShow.forEach(val => {
      tab.columns.push(val.param);
    })
    let data = JSON.stringify(tab);
    send_insert(uri+"api/columns",data) 
      .then(res => { //sprawdzam odpowiedz bo to że jest to jeszcze nie znaczy że jest dobra
        if (typeof res.id !== 'undefined' && res.id > -1){
        console.log(res);
        }else{console.error(res);}
      }).catch(err => console.error(err))
  }


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
      this.reloadHead();
      this.reloadBody();
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
    if (!this.columnsReady) console.log('nie zdążyłem pobrać kolumn');
    
    
    this.el.trHeader.innerHTML = ''; //czyści body i wprowadza nowe dane
    this.columnsToShow.forEach(element => {
      let el = element.param;
      if(!el.show) return;
      const th = document.createElement('th');
      th.classList.add(el.fieldInSql);
      const span = document.createElement('span');
      span.innerText = el.name;
      th.appendChild(span);  //tworzy element html
      this.el.trHeader.appendChild(th);             //dodaje ten element na koniec tr#head
    });
  }
  //--------------------------------------------------------------------------------------KONIEC reloadHead---------------------------

  isChangeHead(newHeaders){//sprawdza czy nowy nagłowek rozni sie od tego w htmlu
    let change = false;
    newHeaders.forEach((el,i) => {
      if (typeof this.el.trHeader.children[i] == 'undefined') change = true; return;
      if (this.el.trHeader.children[i].classList[0] !== el.fieldInSql || this.el.trHeader.children[i].innerText !== el.name) {change = true; return;}
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
    let trChild = allElement.wydatki.table.el.trHeader.children;
    let headers = [];
    for (let i = 0; i < trChild.length; i++){
      headers.push(trChild[i].classList[0])
    }
    this.el.tbody.innerHTML = ''; //czyści body i wprowadza nowe dane
    this.data.resp.forEach(row =>{
      const tr = document.createElement('tr');
      tr.classList.add('trBody');
      headers.forEach(el=>{
        if (el === "data" || el === 'createdDate')  // data jest podawana w długim formacie więc go skracam
          row[el] = formatujDate(row[el]);
        if (row[el] === null || row[el] == 0) row[el] = ''; //nie chce wyświetlac zer i nulli
        const td = document.createElement('td');
        td.classList.add(el);
        td.innerText = row[el];
        tr.appendChild(td);
      });
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
