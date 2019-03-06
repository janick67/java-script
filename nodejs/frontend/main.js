const uri = document.location.href;

let aktualna_tabelka = null;

//-----------------------------------------MAIN----------------------------------
const tabelka = new Tabelka("wydatki","wydatki");
tabelka.adres += 'api/'+tabelka.sql_table+"/query";
tabelka.init();


// -------------------------------------------KONIEC MAIN----------------------

function insert(adres,obiekt){
return $.ajax({
  method: "POST",
  url: adres,
  data: JSON.stringify(obiekt),
  contentType : 'application/json'
});}


/*


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
*/
