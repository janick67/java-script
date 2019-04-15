const uri = document.location.origin + "/";

let aktualna_tabelka = null;
let distinct = new Distinct();

//-----------------------------------------MAIN----------------------------------
const tabelka = new Tabelka("wydatki","wydatki");
tabelka.adres += 'api/'+tabelka.sql_table+"/query";
tabelka.init();


// -------------------------------------------KONIEC MAIN----------------------
