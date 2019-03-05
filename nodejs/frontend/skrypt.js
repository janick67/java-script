const uri = document.location.href;

function Filtr(){

}

Filtr.prototype.pokaz = function(){

}

function Tabelka(id,nazwa)
{
  if (typeof id === 'undefined') id = 'wydatki';
  if (typeof nazwa === 'undefined') nazwa = id;
  this.na_strone = 5;
  this.strona = 1;
  this.object = {};
  this.adres = uri;
  this.nazwa = nazwa;
  this.sql_table = 'wydatki';
  this.id = id;
  this.$div = $(`<div class="divTable" id="${this.id}"></div>`);
  $('div#body').append(this.$div);
  this.$tabela = $(`<table summary="${this.nazwa}"></table>`);
  this.$div.append(this.$tabela);
  this.$trHeader = $('<thead class="thead"><tr class="trHeader"></tr></thead>');
  this.$tabela.append(this.$trHeader);
  this.$tbody = $('<tbody class="tbody"></tbody>');
  this.$tabela.append(this.$tbody);

  this.filtr = new Filtr();

}

Tabelka.prototype.generujHead = function(resp){
  const headers = Object.getOwnPropertyNames(resp[0]);
  headers.forEach(el => {
    const $td = $(`<th class="${el}">${el}</th>`)
    this.$trHeader.children().append($td);
  });
}

Tabelka.prototype.generujBody = function(resp){
  resp.forEach(row =>{
    const $tr = $('<tr class=trBody></tr>');
    for (const el in row){
      if (el === "data")
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


Tabelka.prototype.generuj = function(){
this.generuj_obiekt(); // wygenerowanie domyślnego
    $.getJSON(this.adres,this.object)
    .done(resp => {
      this.generujHead(resp,name);
      this.generujBody(resp,name);
      //this.filtr.dodaj();
    })
    .fail(err => {
      console.log(err)
    });
  };

Tabelka.prototype.generuj_obiekt = function(obj){
  //  console.log("obj: ",obj,'g_obj: ',global_object)
    const obj2 ={
      table: "wydatki",
      limit: 5,
      offset: 0
    }
    const obj_target = Object.assign({},obj2, this.object, obj);
    this.object = obj_target;
    for (const el in obj_target){
      if (obj_target[el] === "") delete obj_target[el];
      //console.log("element: ",obj_target[el]);
    };
   //console.log('obj_target: ', obj_target);
    return obj_target;
  }

//------------------------------------------------------------------------------------------
Tabelka.prototype.pokaz = function(){
  this.$div.hide();
  console.log("prototype pokaz: ",this.$div.siblings(),this.$div);
    this.$div.siblings().siblings().each((index,el) => {
      console.log('petla',$(el));
      tabelka.$div.hide();
      $(el).hide();
    });
    this.$div.show();
    console.log(this.$div);
  }


//---------------------------------------------EVENTY------------------------------


const $btn_next = $('#next');
const $btn_prev = $('#prev');
const $select_na_strone = $('#na_strone');
const $btn_filter = $('#btn_filter');
const $div_body = $('#body');

$btn_next.on('click', function(){
  strona++;
  const obj = generuj_obiekt({offset: na_strone*(strona-1)});
  odswiez_tabelke((obj));
});

$btn_prev.on('click', function(){
  strona--;
  const obj = generuj_obiekt({offset: na_strone*(strona-1)});
  odswiez_tabelke((obj));
});

$select_na_strone.on('change', function() {
  na_strone = this.value;
  const obj = generuj_obiekt({limit: na_strone});
  odswiez_tabelke((obj));
});

$btn_filter.click(function(){
    $filter = $('.trFilter');
    if ($filter.css('display') === 'none'){
      $filter.show();
    }else{
      ukryj_filtr();
  }});

$div_body.on('mouseout', e => {
    $(e.target).closest('tr').removeClass("red");
    $(e.target).closest('td').removeClass("blue");
  });

$div_body.on('mouseover', e => {
  $(e.target).closest('tr').removeClass("red");
  $(e.target).closest('td').removeClass("blue");
  $(e.target).closest('tr').addClass("red");
  $(e.target).closest('td').addClass("blue");
});

$div_body.click( e => {
  const target = e.target;
  if (target.tagName === 'TH'){
    $(`.trFilter .${target.classList[0]} input`).val('');
  }
  if (target.tagName === 'TD'){
    $(`.trFilter`).show();
    let $input = $(`.trFilter .${target.classList[0]} input`);
    if(target.classList[0] === 'Powiązane'){
      console.log("jestem tu jednak ale tylko tu");
      if (target.innerText.length > 0){
       $input = $(`.trFilter .ID input`);
       console.log("jestem tu jednak");
      }else{
       ukryj_filtr();
       return;
     }
    }
    $input.val(target.innerText);
  }
  filtruj();
});


//----------------------------------------------EVENTY KONIEC-----------------------




//-----------------------------------------MAIN----------------------------------
const tabelka = new Tabelka("wydatki","wydatki");
tabelka.adres += 'api/'+tabelka.sql_table+"/query";
tabelka.generuj();


const tabelka2 = new Tabelka("wydatki2","wydatki2");
tabelka2.adres += 'api/'+tabelka.sql_table+"/query";
tabelka2.generuj_obiekt({offset:5});
tabelka2.generuj();

tabelka2.pokaz();

tabelka3.generuj();

tabelka3.pokaz();


// -------------------------------------------KONIEC MAIN----------------------

function insert(adres,obiekt){
return $.ajax({
  method: "POST",
  url: adres,
  data: JSON.stringify(obiekt),
  contentType : 'application/json'
});}

function formatujDate(date){
const data = new Date(date);
//return leadingZero(data.getDate())+"."+leadingZero(data.getMonth())+"."+leadingZero(data.getFullYear());
return leadingZero(data.getFullYear()) + "-" + leadingZero(data.getMonth()+1) + "-" + leadingZero(data.getDate());
}

function leadingZero(i) {
  return (i < 10)? '0'+i : i;
}

/*
pokaz_tabelke(generuj_obiekt());


function ukryj_filtr()
{
    $('.trFilter').hide();
    wyczysc_filtry();
}


function filtruj(){
  let obj = {};
  $tr = $('tr.trFilter').children();
  $tr.each((i,el) =>{
    const value = $(el).children()[0].value;
    obj[el.className] = value;
  });
  //console.log("filtruje:", obj);
  Object.assign(obj,{offset: 0});
  odswiez_tabelke(generuj_obiekt(obj));
}

function wyczysc_filtry(){
  $('tr.trFilter th').each((i,el) =>{
    const value = $(el).children('input').val('');
  });
  filtruj();
}


function odswiez_tabelke(obj){
  //console.log("Odswiezam: ",obj);
  const div = '.divTable';
  $tabela = $($(div).children()[0]);
  $.getJSON($tabela.data("adres"),obj)
  .done(resp => {
    $(div+' tbody').remove();
    const $tbody = $('<tbody class="tbody"></tbody>');
    resp.forEach(row =>{
      const $tr = $('<tr class=trTest></tr>');
      for (const el in row){
        if (el === "data")
        {
          row[el] = formatujDate(row[el]);
        }
        if (row[el] === null || row[el] == 0) row[el] = ''; //nie chce zer i nulli
        const $td = $(`<td class="${el}">${row[el]}</td>`)
        $tr.append($td);
      };
      $tbody.append($tr);
    });
    $tabela.append($tbody);
  })
  .fail(err => {
    console.log(err)
  });
}


function pokaz_tabelke(obj){
  if (obj === undefined) obj = global_object;
  $('div.divTable').each((index,el) => {
    $(el).remove();
  });
  generuj_tabelke(uri+"api/"+obj.table+"/query",obj,obj.table);
  return;
  // poźniej zajme sie optymalizacja
  $tabelka = $('#'+nazwa+"_"+id);
  if ($tabelka.length == 0){
    generuj_tabelke(uri+"api/"+nazwa+"/limit/"+na_strone+"/"+na_strone*(strona-1),nazwa+"_"+id);
}
  $('div.divTable').each((index,el) => {
    $(el).hide();
  });
  $tabelka.show();
}

function dodaj_filtr(){
  if($('div#body .trFilter').length !== 0) return; // jesli jest juz filtr to nie dodajemy nastepnego
  const div = 'div.divTable';
  const $tab = $(div);
  //console.log("filtr: ",$tab);
  const $thead = $($tab.children().children()[0]);
  const klasy = $thead.children().children();
  const ile_kolumn = klasy.length;
  const $tr = $(`<tr class="trFilter"></tr>`);
  for(let i = 0; i < ile_kolumn; i++){
    const $th = $(`<th class="${klasy[i].className}"></th>`);
    const $input = $(`<input type="text" class="${klasy[i].className}"></input>`);
    $th.append($input);
    $tr.append($th);
  //  console.log($tr);
  }
  $tr.on('change',filtruj);
  $thead.append($tr);
  $tr.hide();
}

function generuj_tabelke(adres,obj,id){
  $.getJSON(adres,obj)
  .done(resp => {
    //--------------------- Generowanie html do Tabelki
    const $tabela = $(`<table summary="Wydatki">`);
    $tabela.data("adres",adres);
    $tabela.data("obj",obj);
    const headers = Object.getOwnPropertyNames(resp[0]);
    const $trHeader = $('<thead class="thead"><tr class="trHeader"></tr></thead>');
    headers.forEach(el => {
      const $td = $(`<th class="${el}">${el}</th>`)
      $trHeader.children().append($td);
    });
    $tabela.append($trHeader)
    $tbody = $('<tbody class="tbody"></tbody>');
    resp.forEach(row =>{
      const $tr = $('<tr class=trTest></tr>');
      for (const el in row){
        if (el === "data")
        {
          row[el] = formatujDate(row[el]);
        }
        if (row[el] === null || row[el] == 0) row[el] = ''; //nie chce zer i nulli
        const $td = $(`<td class="${el}">${row[el]}</td>`)
        $tr.append($td);
      };
      $tbody.append($tr);
    });
    $tabela.append($tbody);
    const $div = $(`<div class="divTable" id="${id}"></div>`);
    $div.append($tabela);
    $('div#body').append($div);
    dodaj_filtr();
//---------------------------------------Koniec--------------
  })
  .fail(err => {
    console.log(err)
  });
}

  function generuj_obiekt(obj){
  //  console.log("obj: ",obj,'g_obj: ',global_object)
    const obj2 ={
      table: "wydatki",
      limit: 5,
      offset: 0
    }
    const obj_target = Object.assign({},obj2, global_object, obj);
    global_object = obj_target;
    for (const el in obj_target){
      if (obj_target[el] === "") delete obj_target[el];
      //console.log("element: ",obj_target[el]);
    };
   //console.log('obj_target: ', obj_target);
    return obj_target;
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
  //return leadingZero(data.getDate())+"."+leadingZero(data.getMonth())+"."+leadingZero(data.getFullYear());
  return leadingZero(data.getFullYear()) + "-" + leadingZero(data.getMonth()+1) + "-" + leadingZero(data.getDate());
}

function leadingZero(i) {
    return (i < 10)? '0'+i : i;
}


/*insert(uri+"/api/test",mdata) //insert
.done(resp => {
    console.log(resp);
})
.fail(err => {
  console.log(err)
});*/
