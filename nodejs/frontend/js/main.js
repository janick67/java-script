const uri = document.location.origin + "/";

let aktualna_tabelka = null;
let distinct = new Distinct();


setTimeout(function () {
  distinct.init();
  console.log("elo");
}, 1000);

//-----------------------------------------MAIN----------------------------------
const tabelka = new Tabelka("wydatki","wydatki");
tabelka.adres += 'api/'+tabelka.sql_table+"/query";
tabelka.init();


// -------------------------------------------KONIEC MAIN----------------------
