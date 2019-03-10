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
