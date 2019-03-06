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
  this.$div.data('obj',this);
  this.$tabela = $(`<table summary="${this.nazwa}"></table>`);
  this.$div.append(this.$tabela);
  this.$div.hide();
  this.$thead = $('<thead class="thead"><tr class="trHeader"></tr></thead>');
  this.$tabela.append(this.$thead);
  this.$tbody = $('<tbody class="tbody"></tbody>');
  this.$tabela.append(this.$tbody);
  this.filtr = null;
}

Tabelka.prototype.generujHead = function(resp){
  const headers = Object.getOwnPropertyNames(resp[0]);
  headers.forEach(el => {
    const $td = $(`<th class="${el}">${el}</th>`)
    this.$thead.children().append($td);
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
      this.generujHead(resp);
      this.generujBody(resp);
      //this.filtr.dodaj();
    })
    .fail(err => {
      console.log(err)
    });
    return this;
  };

Tabelka.prototype.generuj_obiekt = function(obj){
  // console.log("obj: ",obj,'g_obj: ',global_object)
    const obj2 ={
      table: "wydatki",
      limit: this.na_strone,
      offset: (this.strona-1)*this.na_strone
    }
    const obj_target = Object.assign({},obj2, this.object, obj);
    this.object = obj_target;
    for (const el in obj_target){
      if (obj_target[el] === "") delete obj_target[el];
      //console.log("element: ",obj_target[el]);
    };
   //console.log('obj_target: ', obj_target);
   //console.log('obj',obj,'obj2', obj2,'object', this.object,'target',obj_target);
    return obj_target;
  }

//------------------------------------------------------------------------------------------
Tabelka.prototype.pokaz = function(){
  //console.log("prototype pokaz: ",this.$div.siblings(),this.$div);
    this.$div.siblings().siblings().each((index,el) => {
      //console.log('petla',$(el));
      $(el).hide();
    });
    this.$div.show();
    aktualna_tabelka = this;
    //console.log(this.$div);
  }
//-------------------------------------------------------------------------------------------

Tabelka.prototype.odswiez = function(){
  //console.log("Odswiezam: ",obj);
  this.generuj_obiekt();
  //console.log(this.adres, this.object);
  $.getJSON(this.adres,this.object)
  .done(resp => {
    this.$tbody.children().remove();
    //console.log(resp);
    this.generujBody(resp);
  })
  .fail(err => {
    console.log(err)
  });
}

//--------------------------------------------------------------------------------------------

Tabelka.prototype.dodaj_filtr = function(){
  this.filtr = new Filtr(this);
}

// ----------------------------------------------------------------------------------------------

function Filtr(tabelka){
    this.tabelka = tabelka;
    this.$tr = $(`<tr class="trFilter"></tr>`);
    this.wygenerowane = 0;
    this.object = {};
}

Filtr.prototype.generuj = function(){
  if (this.wygenerowane == 1) return;
  console.log("generuj");
  const klasy = this.tabelka.$thead.children().children('TH');
  const ile_kolumn = klasy.length;
  for(let i = 0; i < ile_kolumn; i++){
    const $th = $(`<th class="${klasy[i].className}"></th>`);
    const $input = $(`<input type="text" class="${klasy[i].className}"></input>`);
    this.object[klasy[i].className] = '';
    $th.append($input);
    this.$tr.append($th);
  //  console.log($tr);
  }
  this.tabelka.$thead.append(this.$tr);
  this.$tr.hide();
  this.wygenerowane = 1;
  this.$tr.on('change', e => {
    const kliknieta_tabelka = $(e.target).closest('.divTable').data('obj');
    kliknieta_tabelka.filtr.ustaw(e.target);
  });
}

Filtr.prototype.pokaz = function(){
  if (this.wygenerowane === 0) this.generuj();
  this.$tr.show();
  console.log('display pokaz',this.$tr.css('display'));
}

Filtr.prototype.toggle = function(){
  if (this.wygenerowane == 0) this.generuj();
  if (this.$tr.css('display') === 'none'){
      this.$tr.show();
      console.log('display none',this.$tr.css('display'));
  }else{
      console.log('display not none',this.$tr.css('display'));
      this.ukryj();
}
}

Filtr.prototype.ukryj = function(){
  this.$tr.hide();
  console.log('display hide',this.$tr.css('display'));
  this.wyczysc();
}

Filtr.prototype.wyczysc = function(){
  console.log('wyczysc');
  for (el in this.object)
  {
    this.object[el] = '';
  }
  this.zastosuj();
}

Filtr.prototype.zastosuj = function(){
  console.log("zastosuj");
  this.odswiez();
  //console.log("filtruje:", obj);
  const obj = Object.assign({},this.object,{offset: 0});
  this.tabelka.generuj_obiekt(obj);
  this.tabelka.odswiez() ///(generuj_obiekt(obj));
}

Filtr.prototype.ustaw = function(target){
  if (this.wygenerowane === 0) this.generuj();
  if (target.tagName === 'TH'){
    this.object[target.classList[0]] = "";
  }
  if (target.tagName === 'TD'){
    if(target.classList[0] === 'Powiązane'){
      if (target.innerText.length > 0){
       this.object['ID'] = target.innerText;
      }else{
       this.ukryj();
       return;
     }
    }
    this.pokaz();
    this.object[target.classList[0]] = target.innerText;
  }
  this.zastosuj();
}

Filtr.prototype.odswiez = function(){
console.log("odswiez");
$(this.$tr.children()).each((i,el) =>{
  el.querySelector('input').value = this.object[el.className];
});
}
