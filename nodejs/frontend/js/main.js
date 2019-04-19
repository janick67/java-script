const uri = document.location.origin + "/";

let aktualna_tabelka = null;
let insert = new Insert();

//-----------------------------------------MAIN----------------------------------
const tabelka = new Tabelka("wydatki","wydatki");
tabelka.adres += 'api/'+tabelka.sql_table+"/query";
tabelka.init();
insert.init();


// -------------------------------------------KONIEC MAIN----------------------




function rules(){ // funkcja konfigurująca, ustawiam tu wymagania przy walidacji inputow i ewentualne informacje przy bledach, zwraca obiekt zawierający wszystkie regoly pogrupowane na kolumny
  const m = {required:'Pole {title} jest wymagane.',
  min:'Wymagane przynajmniej {min} znaki.',
  cur:'Podaj prawidłową wartosc',
  data:'Podaj prawidłową date'};
  const rules = {}; //obiekt ktory bedzie zawierał wszystkie bledy
  rules.bank = {title: 'Bank',required:{required:true,message:m.required},min:{min:3,message:m.min}};
  rules.kwota = {title: 'Kwota',required:{required:true,message:m.required},currency:{currency:true,message:m.cur}};
  rules.data = {title: 'Data',required:{required:true,message:m.required},date:{format:'ymd',message:m.data},min:{min:3,message:m.min}};
  rules.typ = {title: 'Typ',required:{required:true,message:m.required},min:{min:3,message:m.min}};
  rules.typ2 = {title: 'Typ2',required:{required:true,message:m.required},min:{min:3,message:m.min}};
  rules.gdzie = {title: 'Gdzie',required:{required:true,message:m.required},min:{min:3,message:m.min}};
  rules.kogo = {title: 'Kogo',required:{required:true,message:m.required},min:{min:3,message:m.min}};
  rules.osoba = {title: 'Osoba'};
  rules.powiazane = {title: 'Powiązane'};
  rules.opis = {title: 'Opis'};
  return rules; // zwraca obiekt zawierający wszystkie regoly pogrupowane na kolumny
}

function sprawdz(dane){ // funkcja walidujaca dane, zwraca tablice z ewentualnymi bledami
  const rule = rules();
  const errors = {};// w tym obiekcie beda zapisane wszystkie bledy ktore wystapia
  for (const kol in rule){
    if (typeof rule[kol] === 'undefined') continue; // jeśli nie znalazl żadnej reguły to nie ma co sprawdzac wiec pomija
    const aprv = approve.value(dane[kol], rule[kol]) //funkcja sprawdzajaca dane, zwraca obiekt
    if (!aprv.approved){ //zwracany obiekt zawiera approved ktore jest rowne 1 jesli wszystko jest ok i 0 gdy cos nie przeszlo testow
      errors[kol] = aprv.errors; // przytpisuje tablice błedow do konkretnej kolumny
    }}
  return errors;//zwraca obiekt z elementami kolumn a w nich tablice z błedami
}

function send_insert(adres,obiekt){// wysyła dane postem, w obiekcie sa dane ktore zostana wyslane do sql
return $.ajax({
  method: "POST",
  url: adres,
  data: JSON.stringify(obiekt),
  contentType : 'application/json'
})}

function formatujDate(date){
const data = new Date(date);
return leadingZero(data.getFullYear()) + "-" + leadingZero(data.getMonth()+1) + "-" + leadingZero(data.getDate());
}

function leadingZero(i) {
  return (i < 10)? '0'+i : i;
}

function wyloguj()
{
    window.location.href = uri+"logout";
}
