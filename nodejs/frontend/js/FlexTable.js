
class FlexTable{

  constructor(data,options){ //type 0 - bezpośrednio, 1 - wydatki
    this.data = data;
    this.options = options;
    this.el = {};
    docReady(()=>{
     this.init();
    })
  }
  //----------------------------------------------------------------------------------KONIEC konstruktora Tabelka------------------------

  
  init(){
  }
  
  generate(){
    return new Promise((resolve,reject)=>{
      this.fragment = document.createDocumentFragment();
    this.el.table = makeDiv('flexTable');
    this.el.thead = makeDiv('thead');
    this.el.tbody = makeDiv('tbody');
    let {table} = this.el;
    let {thead} = this.el;
    let {tbody} = this.el;
    let data = this.data;

    let headers = Object.getOwnPropertyNames(data[0]);
    let headRow = makeDiv('tr head');
    headers.forEach(col=>{
      let th = makeDiv('th column');
      let span = document.createElement('span');
      span.innerText = col;
      th.setAttribute('col',col)
      th.append(span);
      headRow.append(th);
    });
    thead.append(headRow);
    table.append(thead);


    data.forEach(row=>{
      let tr = makeDiv('tr');
      headers.forEach(col=>{
        let td = makeDiv('td');
        let span = document.createElement('span');
        span.innerText = row[col];
        td.setAttribute('col',col)
        td.append(span);
        tr.append(td)
      })
      tbody.append(tr);
    })



    table.append(tbody);
    this.fragment.append(table);
    resolve();
    })
  }
  
  reload(data){
    return this.generate();
  }
 
}

let makeDiv = divClass => {
  let classes = divClass.split(' ');
  let div = document.createElement('div');
  classes.forEach(el=>{
    div.classList.add(el);
  })
  return div;
  }


  let setMargin = (e) => {
    let thead = document.querySelector('.thead');
    let style = window.getComputedStyle(thead);
    let tbody = document.querySelector('.tbody');
    if (style.position == 'fixed'){
      tbody.style.marginTop = parseInt(style.height)+10+'px';
    }else{
      tbody.style.marginTop = 0;
    }
  }

  
