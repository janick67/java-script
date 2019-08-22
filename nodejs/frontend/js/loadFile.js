let firstScreanHTML = '';

function handleFileSelect(evt) {
    $('#modal_add').modal('hide');
    evt.stopPropagation();
    evt.preventDefault();
  
    var files = evt.dataTransfer.files; // FileList object.
    f = files[0];
    f.extension = f.name.match(/\.[0-9a-z]+$/i)[0]; //rozszerzenie pliku
    //console.log(f);
    
  
    var reader = new FileReader();
    reader.readAsText(f, 'UTF-8');
    reader.onprogress = function(evt) {
    };
    reader.onload = function(evt) {
      let result = evt.target.result;
      let data = {};
      if (f.type == 'application/json' || f.extension  == '.json' ){
        let res = JSON.parse(result);
        if (typeof res[2].data != 'undefined'){
          data = res[2].data;
        }else{
          data = res;
        }
      }else if(f.extension == '.csv'){
        data = csvObj(result);
      }else{
        data = result;
      }
      
      first(data);

    };
    reader.onerror = function(evt) {
       alert('Błąd wczytywania pliku!');
    };
  }

  let first = (data)=>{
    $('#modal_load_file').modal('show');
      let tab = document.createElement('table');
      let trHead = document.createElement('tr');   
      for (const el in data[0]){
          let th = document.createElement('th');
          th.innerText = el;
          trHead.append(th);
      }
      tab.append(trHead); 

      let tbody = document.createElement('tbody');
      data.forEach(row => {
        let tr = document.createElement('tr');
        for (const e in row){
            let td = document.createElement('td');
            td.innerText = row[e];
            tr.append(td);
        }
        tbody.append(tr);
      })
      tab.append(tbody);
      document.querySelector('#lfTable').innerHTML='';
      document.querySelector('#lfTable').append(tab);

      let tab2 = document.createElement('table');
      tab2.classList.add('selectsTable');
      let trHead2 = document.createElement('tr');
      let tr2 =document.createElement('tr');

      getJson('/api/wydatki/columns')
      .then(resp => {
        let respTable = [];
        resp.forEach(el=>{
          let col = el.column_name
          if (col == 'id' || col == 'userId' || col == 'createdData') return;
          respTable.push(col);
        });

          let matched = matchHead(data[0],respTable);

          respTable.forEach(col => {
            let th2 = document.createElement('th');
            th2.innerText = col;
            trHead2.append(th2);
            let td2 = document.createElement('td');
            let select = document.createElement('select');
            select.classList.add('form-control');
            let option = document.createElement('option');
                option.innerText = '';
                option.value = '';
                select.append(option);
            for (const el in data[0]){
                let option = document.createElement('option');
                option.innerText = el;
                option.value = el;
                select.append(option);
            } 
            select.setAttribute('for',col);
            if (typeof matched[col].file != 'undefined') select.value = matched[col].file;
            td2.append(select);
            tr2.append(td2);
          })
          tab2.append(trHead2);
          tab2.append(tr2);   
          document.querySelector('#lfSelects').innerHTML='';
          document.querySelector('#lfSelects').append(tab2);
          document.querySelector('#lfNext').onclick = (e)=>{
            document.querySelectorAll('#lfSelects select').forEach((el)=>{
              matched[el.getAttribute('for')].select = el.value;
            });
            second(data,matched);
          }
      })

  }

  let second = (data,columns) => {
    let lfBody = document.querySelector('#lfBody');
    firstScreanHTML = lfBody.innerHTML;    
    $('#modal_load_file').on('hide.bs.modal',()=>{
      window.setTimeout(()=>{lfBody.innerHTML = firstScreanHTML;},100); //żeby nie było widać podczas zamykania że się wraca do pierwszego okna
    })
    lfBody.innerHTML = '<div class="box"><h2>Podgląd danych do wprowadzenia:</h2><button id="lfSubmit" class="btn btn-primary">Potwierdź</button></div><div id="lfTable"></div>';
    let readyData = [];
    if (typeof columns != 'undefined'){
      data.forEach(row => {
        let obj = {};
        for (const el in columns){
          let se = columns[el].select;          
             obj[el] = row[se];
        }
        readyData.push(obj);
      })
    }else{
      readyData = data;
    }

    let tab = document.createElement('table');
      let trHead = document.createElement('tr');   
      for (const el in readyData[0]){
          let th = document.createElement('th');
          th.innerText = el;
          trHead.append(th);
      }
      tab.append(trHead); 

      let tbody = document.createElement('tbody');
      readyData.forEach((row,i) => {
        let tr = document.createElement('tr');
        for (const col in row){
            let td = document.createElement('td');
            td.setAttribute('row',i);
            td.setAttribute('col',col);
            td.innerText = row[col];
            tr.append(td);
        }
        tbody.append(tr);
      })
      tbody.ondblclick = e =>{
        let el = e.target;
        if (el.tagName == 'TD'){
          let input = document.createElement('input');
          input.value = el.innerText;
          el.innerHTML = '';
          input.onfocusout = e =>{
            let row = e.target.parentNode.getAttribute('row');
            let col = e.target.parentNode.getAttribute('col');
            readyData[row][col] = e.target.value;
            e.target.parentNode.innerHTML = e.target.value;
          }
          el.append(input);
          input.focus();
        }
      }
      tab.append(tbody);
      document.querySelector('#lfTable').innerHTML='';
      document.querySelector('#lfTable').append(tab);
      document.querySelector('#lfSubmit').onclick = e =>{
        let errors = 0;
        readyData.forEach((row,i) => {
          const err = sprawdz(row);
          errors += Object.keys(err).length; 
          for (const el in row){ // pętla po wszystkich kolumnach
          if (typeof err[el] === 'undefined') { // jeśli nie ma błędow dla tego elementu to znaczy ze wszystko jest ok
          }else{
            let elem = document.querySelector(`td[row="${i}"][col="${el}"]`);
            elem.classList.add('error');
            elem.title = err[el][0];
          }
        }
      });
      if (errors > 0)
       console.log("Znaleziono następującą liczbę błędów: "+errors);
      else {
        send_insert(uri+"api/wydatki",readyData).then(res=>{
          let err = res.errors;
          let errorRows = [];
          tab.classList.add('lfCheck');
          if (err.length == 0){
            console.log('Udało się bezbłędnie wysłać!'); 
            $('#modal_load_file').modal('hide');           
          }else{
              err.forEach(el=>{
              let tr = document.querySelectorAll(`td[row="${el.row}"]`)[0].parentNode;
              tr.classList.add('error');
              errorRows.push(readyData[el.row]); 
              Object.getOwnPropertyNames(el.message).forEach((col)=>{
                let elem = document.querySelector(`td[row="${el.row}"][col="${col}"]`);
                elem.classList.add('error');
                elem.title = el.message[col][0];
              })
            });
            let bigOne = document.querySelector('#modal_load_file');
            let smallOne = document.querySelector('#modal_load_file_accept');
            $(smallOne).modal('show');
            let oldBigOneZindex = bigOne.style.zIndex;
            bigOne.style.zIndex = 1000;
            smallOne.querySelector('.modal-dialog').style.top = '30vh';
            $(smallOne).on('hide.bs.modal',()=>{
              bigOne.style.zIndex = oldBigOneZindex;
            })	
            document.querySelector('#lfCorrect').onclick = e=>{
              $(smallOne).modal('hide');
              second(errorRows);
            }
            document.querySelector('#lfIgnore').onclick = e=>{
              $(smallOne).modal('hide');
              $(bigOne).modal('hide');
            }
          }
        }).catch(err => console.error("moj blad",err));
      }
    }
  }

  let matchHead = (data,headers) => {
    let dataHead = Object.getOwnPropertyNames(data);
    // console.log(data,dataHead,headers);
    let matched = {};
    headers.forEach(el=>{
      matched[el] = {};
      matched[el].file = dataHead.find(e => comp(el,e));
    })
    return matched;    
  }

  let comp = (el1,el2) => {
    if (typeof el1 != 'undefined') el1 = el1.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase(); //pozbycie się polskich znaków
    else return false;
    if (typeof el2 != 'undefined') el2 = el2.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase(); 
    else return false;
    return el1 == el2; 
  }
  
  function csvObj(csv){
    var lines=csv.split("\n");
    var result = [];
    for(var i=1;i<lines.length;i++){
        var obj = {};
        var currentline=lines[i].split(",");
        for(var j=0;j<currentline.length;j++){
        obj[j] = currentline[j];
        }
        result.push(obj);
    }
    return result; //JavaScript object
  }
  
  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }
  
  // Setup the dnd listeners.

  let dropZone = document.querySelector('#modal_add .modal-dialog');
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleFileSelect, false);