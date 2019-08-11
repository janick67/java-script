//=========================================================================================================================================//
//-----------------------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------------------------Obiekt Tabelka-------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------------------------------------//
//=========================================================================================================================================//

// ----------------------------------------------------------------------------------- Konstruktor Tabelka --------------------
class Table{

  constructor(data,type){ //type 0 - bezpośrednio, 1 - wydatki
    this.data = data;
    this.id = this.data.id;
    this.filtr = null;
    this.columnsReady = false;
    this.columnsToShow = [];
    this.el = {}; // zawiera wszystkie elementy html
    this.getColumns();
    this.type = type;
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
    new Sortable(document.getElementById('editTableList'), {
      handle: '.handle', // handle's class
      animation: 150
  });
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
    this.el.template = document.querySelector("template#table").content;
    this.el.mainDiv = this.el.template.querySelector('.mainDiv').cloneNode(true);
    let {mainDiv} = this.el;
    mainDiv.setAttribute('id',this.id);
    mainDiv.style.display = 'none'; //zaraz po utworzeniu jest ukrywane
    this.el.divTableLg = mainDiv.querySelector('.divTable.lg');
    this.el.divTableXs = mainDiv.querySelector('.divTable.xs');
    

    this.el.table = mainDiv.querySelector('table');
    this.el.table.setAttribute('summary',this.nazwa);

    this.el.editButton = mainDiv.querySelector('.editButton');
    this.el.table.append(this.el.editButton);

    this.el.thead = mainDiv.querySelector('thead');

    this.el.trHeader = mainDiv.querySelector('tr.trHeader');

    this.el.tbody = mainDiv.querySelector('tbody');

    this.el.paginacja = mainDiv.querySelector('.pagination')

    this.el.paginacja.querySelector('.pag_next')
    .onclick = e => actualData.table.zmienStrone(actualData.data.page*1+1)

    this.el.paginacja.querySelector('.pag_prev')
    .onclick = e => actualData.table.zmienStrone(actualData.data.page*1-1)
    this.el.paginacja.querySelector('.pag_prev').disabled = true;

    this.el.paginacja.querySelector('.pag_per_page')
    .addEventListener('change', e => {
    const it = actualData.table;
    it.data.param.offset = 0;
    this.data.page = 1;
    this.el.strona.value = 1;
    it.data.param.limit = e.target.value;
    it.reload();
    })

    this.el.strona = this.el.paginacja.querySelector('.pag_page');
    this.el.strona.addEventListener('change', e => {
    actualData.table.zmienStrone(e.target.value);
    });

    this.el.divTableLg.addEventListener('mouseout', e => {
    getClossestTag(e.target,'tr').classList.remove('red');
    getClossestTag(e.target,'td').classList.remove('blue')
    });

    this.el.divTableLg.addEventListener('mouseover', e => {
    getClossestTag(e.target,'tr').classList.add('red');
    getClossestTag(e.target,'td').classList.add('blue')
    });

    this.el.divTableLg.onclick = e => {
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
    for (let i = 0; i < el.length; i++){ // od 1 żeby pominąć template
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
    // console.log(tab);
    
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
    //console.trace(this.data.resp);
    //console.log('resp = ' , this.data.resp.length);
    if (this.data.resp.length > 0){
      this.reloadTable();
      document.querySelector('.emptyTable').innerHTML='';
    }else{
      this.el.divTableLg.innerHTML = '';
      this.el.divTableXs.innerHTML = '';
      document.querySelector('.emptyTable').append('Brak danych');
    }
    })
  }
  //----------------------------------------------------------------------------------------Koniec reload--------------------------------

  reloadTable(){
    if(checkBootstrapSizeMode() != 'xs'){
      this.reloadHead();
      this.reloadBody();
    }else{
      this.reloadXs();
    }
  }

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
    let fragment = document.createDocumentFragment();
    this.columnsToShow.forEach(element => {
      let el = element.param;
      if(!el.show) return;
      const th = document.createElement('th');
      th.classList.add(el.fieldInSql);
      const span = document.createElement('span');
      span.innerText = el.name;
      th.appendChild(span);  //tworzy element html
      fragment.appendChild(th);             //dodaje ten element na koniec tr#head
    });
    this.el.trHeader.innerHTML = ''; //czyści body i wprowadza nowe dane
    this.el.trHeader.append(fragment);
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
    let fragment = document.createDocumentFragment();
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
      fragment.appendChild(tr);
    });   
    this.el.tbody.innerHTML = ''; //czyści body i wprowadza nowe dane
    this.el.tbody.append(fragment);
  }
  //--------------------------------------------------------------------------------------KONIEC reloadBody-----------------------------

  reloadXs(){
    let fragment = document.createDocumentFragment();
    this.el.templateXs = document.querySelector("template#tableXs").content;    
    let xs = this.el.templateXs;
    
    this.data.resp.forEach(row =>{
      let container = xs.querySelector('.container').cloneNode(true);
      container.querySelector('.date').innerText = formatujDate(row.data);
      container.querySelector('.title').innerText = row.typ;
      container.querySelector('.title2').innerText = row.typ2;
      container.querySelector('.cash').innerText = row.kwota;
      fragment.append(container);
    });
    this.el.divTableXs.innerHTML = '';
    this.el.divTableXs.append(fragment);
  }


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
    if(nowaStrona == 1) {
      this.el.paginacja.querySelector('.pag_prev').disabled = true;
    }else{
      this.el.paginacja.querySelector('.pag_prev').disabled = false;
    }
  }
  //----------------------------------------------------------------------------------------Koniec zmienStrone------------------------------------


  //-------------------------------------------------------------------------------------------sortuj-------------------------------------
  // #FUNCTION# ===================================================================
  // Name ..........: sortuj
  // Description ...: Przelacza strone i wywołuje odswiezenie
  // Syntax ........: sortuj(obj target)
  // Parameter(s): .: target - komorka wedgług ktorej ma byc posortowana tabelka
  // Return Value ..: -
  // Used in .......: divTable.onclick
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
