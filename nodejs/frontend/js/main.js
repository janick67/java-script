const uri = document.location.origin + "/";

// setInterval(()=>{document.querySelector('[role="dialog"][class="style-scope ytd-popup-container"]').querySelector('[class="style-scope paper-button"]').click();},60000)
// const ob = {ob:'cos',obj:{imie:'afsd', nazwisko:'siema'}, inne:{}};
//   console.log(ob);
//   console.log("moje: ",getUrlString('',ob));
//   console.log("jquery: ",$.param(ob));

  // getJson("",{name:'jan'})
  // .then(res => res.json())
  // .then(res => { console.log(res)});


  //-----------------------------------------MAIN----------------------------------
let actualBootstrapSize = 'lg';
let actualData = null; // zawiera wksaźnik do tabelki ktora jest aktualnie wyswietlana uzytkownikowi
let insert = new Insert();
docReady(()=>{
insert.init();
})
const allElement = {};

document.addEventListener('keydown',(e)=>{
  if (e.keyCode == 27 && document.querySelector('#modal_edit_table').classList.contains('show'))
    document.querySelector('#et_close').click();

 if (e.keyCode == 13 && document.querySelector('#modal_edit_table').classList.contains('show'))
  document.querySelector('#et_submit').click();
})

//first(JSON.parse(`[{"bank":"Mbank","kwota":"-14.99","data":"2019-07-30","typ":"ZAKUP","typ2":"jakies","gdzie":"pepco","kogo":"moje","osoba":"","powiazane":"","opis":"PEPCO 1513 RABKA 1 /RABKA                                             DATA TRANSAKCJI: 2019-07-28"},{"bank":"Mbank","kwota":"-52.97","data":"2019-08-04","typ":"ZAKUP","typ2":"inne","gdzie":"house","kogo":"moje","osoba":"","powiazane":"","opis":"LPP HOUSE 3112039  /KRAKOW                                            DATA TRANSAKCJI: 2019-08-02"},{"bank":"Mbank","kwota":"-20.22","data":"2019-08-04","typ":"ZAKUP","typ2":"dziwne","gdzie":"carefour","kogo":"moje","osoba":"","powiazane":"","opis":"CARREFOUR          /KRAKOW                                            DATA TRANSAKCJI: 2019-08-02"}]`));
//first(JSON.parse(`[{"0":"2019-07-30","1":"2019-07-30","2":"ZAKUP PRZY UŻYCIU KARTY","3":"PEPCO 1513 RABKA 1 /RABKA                                             DATA TRANSAKCJI: 2019-07-28","4":"  ","5":"''","6":"-14,99","7":"1 823,32","8":""},{"0":"2019-08-04","1":"2019-08-04","2":"ZAKUP PRZY UŻYCIU KARTY","3":"LPP HOUSE 3112039  /KRAKOW                                            DATA TRANSAKCJI: 2019-08-02","4":"  ","5":"''","6":"-52,97","7":"1 770,35","8":""},{"0":"2019-08-04","1":"2019-08-04","2":"ZAKUP PRZY UŻYCIU KARTY","3":"CARREFOUR          /KRAKOW                                            DATA TRANSAKCJI: 2019-08-02","4":"  ","5":"''","6":"-20,22","7":"1 750,13","8":""},{"0":"2019-08-04","1":"2019-08-04","2":"ZAKUP PRZY UŻYCIU KARTY","3":"McDonalds 01       /Krakow                                            DATA TRANSAKCJI: 2019-08-02","4":"  ","5":"''","6":"-8,00","7":"1 742,13","8":""},{"0":"2019-08-05","1":"2019-08-05","2":"ZAKUP PRZY UŻYCIU KARTY","3":"JMP S.A. BIEDRONKA /WLADYSLAWO                                        DATA TRANSAKCJI: 2019-08-03","4":"  ","5":"''","6":"-45,93","7":"1 696,20","8":""},{"0":"2019-08-05","1":"2019-08-05","2":"ZAKUP PRZY UŻYCIU KARTY","3":"WORLD PRESS SALONIK/WLADYSLAWO                                        DATA TRANSAKCJI: 2019-08-03","4":"  ","5":"''","6":"-4,00","7":"1 692,20","8":""},{"0":"2019-08-06","1":"2019-08-06","2":"BLIK ZAKUP E-COMMERCE","3":"DOTPAY S.A.","4":"  ","5":"''","6":"-37,96","7":"1 654,24","8":""},{"0":"2019-08-06","1":"2019-08-06","2":"ZAKUP PRZY UŻYCIU KARTY","3":"Karczma Swojskie Ja/Wladyslawo                                        DATA TRANSAKCJI: 2019-08-03","4":"  ","5":"''","6":"-28,00","7":"1 626,24","8":""},{"0":"2019-08-07","1":"2019-08-07","2":"ZAKUP PRZY UŻYCIU KARTY","3":"JOLANTA NIKLAS     /ROZEWIE                                           DATA TRANSAKCJI: 2019-08-05","4":"  ","5":"''","6":"-12,96","7":"1 613,28","8":""},{"0":"2019-08-07","1":"2019-08-07","2":"ZAKUP PRZY UŻYCIU KARTY","3":"Okulski Grand      /Wladyslawo                                        DATA TRANSAKCJI: 2019-08-05","4":"  ","5":"''","6":"-22,00","7":"1 591,28","8":""},{"0":"2019-08-08","1":"2019-08-08","2":"ZAKUP PRZY UŻYCIU KARTY","3":"LATARNIA PARK      /JASTRZEBIA                                        DATA TRANSAKCJI: 2019-08-06","4":"  ","5":"''","6":"-12,00","7":"1 579,28","8":""},{"0":"2019-08-08","1":"2019-08-08","2":"ZAKUP PRZY UŻYCIU KARTY","3":"PIOTR I PAWEL ZACHO/GDANSK                                            DATA TRANSAKCJI: 2019-08-06","4":"  ","5":"''","6":"-15,54","7":"1 563,74","8":""},{"0":"2019-08-08","1":"2019-08-08","2":"ZAKUP PRZY UŻYCIU KARTY","3":"JOLANTA NIKLAS     /ROZEWIE                                           DATA TRANSAKCJI: 2019-08-06","4":"  ","5":"''","6":"-3,60","7":"1 560,14","8":""},{"0":"2019-08-08","1":"2019-08-08","2":"ZAKUP PRZY UŻYCIU KARTY","3":"GDANSKI OGROD ZOOLO/GDANSK                                            DATA TRANSAKCJI: 2019-08-06","4":"  ","5":"''","6":"-100,00","7":"1 460,14","8":""},{"0":"2019-08-09","1":"2019-08-09","2":"ZAKUP PRZY UŻYCIU KARTY","3":"F.H.U. ANNA MACH-50/Wladyslawo                                        DATA TRANSAKCJI: 2019-08-07","4":"  ","5":"''","6":"-12,00","7":"1 448,14","8":""},{"0":"2019-08-10","1":"2019-08-10","2":"BLIK P2P-PRZYCHODZĄCY","3":"Przelew na telefon                 Od: 48536334450 Do: 48509004078","4":"  ","5":"''","6":"26,00","7":"1 474,14","8":""},{"0":"2019-08-10","1":"2019-08-10","2":"BLIK P2P-PRZYCHODZĄCY","3":"Przelew BLIK na telefon","4":"  ","5":"''","6":"36,00","7":"1 510,14","8":""},{"0":"2019-08-11","1":"2019-08-11","2":"ZAKUP PRZY UŻYCIU KARTY","3":"F.H.U. ANNA MACH-50/Wladyslawo                                        DATA TRANSAKCJI: 2019-08-09","4":"  ","5":"''","6":"-12,00","7":"1 498,14","8":""},{"0":"2019-08-11","1":"2019-08-11","2":"BLIK ZAKUP E-COMMERCE","3":"PAYPRO S.A.","4":"  ","5":"''","6":"-38,77","7":"1 459,37","8":""},{"0":"2019-08-12","1":"2019-08-12","2":"PRZELEW ZEWNĘTRZNY WYCHODZĄCY","3":"PRZELEW ŚRODKÓW","4":"DAWID WORWA  ","5":"'13102034660000930201399096'","6":"-50,00","7":"1 409,37","8":""},{"0":"2019-08-12","1":"2019-08-12","2":"ZAKUP PRZY UŻYCIU KARTY","3":"KONKOL SP. Z O.O.  /JASTRZEBIA                                        DATA TRANSAKCJI: 2019-08-10","4":"  ","5":"''","6":"-7,55","7":"1 401,82","8":""},{"0":"2019-08-12","1":"2019-08-12","2":"ZAKUP PRZY UŻYCIU KARTY","3":"Dorota Klofczynsk51/Jastrzebia                                        DATA TRANSAKCJI: 2019-08-10","4":"  ","5":"''","6":"-63,00","7":"1 338,82","8":""},{"0":"2019-08-12","1":"2019-08-12","2":"ZAKUP PRZY UŻYCIU KARTY","3":"GRUPA SPORTEX SC 01/Wladyslawo                                        DATA TRANSAKCJI: 2019-08-10","4":"  ","5":"''","6":"-18,00","7":"1 320,82","8":""},{"0":"2019-08-12","1":"2019-08-12","2":"ZAKUP PRZY UŻYCIU KARTY","3":"GRUPA SPORTEX SC   /Wladyslawo                                        DATA TRANSAKCJI: 2019-08-10","4":"  ","5":"''","6":"-30,00","7":"1 290,82","8":""},{"0":"2019-08-12","1":"2019-08-12","2":"ZAKUP PRZY UŻYCIU KARTY","3":"F.H.U. ANNA MACH-50/Wladyslawo                                        DATA TRANSAKCJI: 2019-08-10","4":"  ","5":"''","6":"-12,00","7":"1 278,82","8":""},{"0":"2019-08-12","1":"2019-08-12","2":"ZAKUP PRZY UŻYCIU KARTY","3":"JMP S.A. BIEDRONKA /WLADYSLAWO                                        DATA TRANSAKCJI: 2019-08-10","4":"  ","5":"''","6":"-22,41","7":"1 256,41","8":""},{"0":"2019-08-14","1":"2019-08-14","2":"ZAKUP PRZY UŻYCIU KARTY","3":"McDonalds          /Nowy Targ                                         DATA TRANSAKCJI: 2019-08-12","4":"  ","5":"''","6":"-14,00","7":"1 242,41","8":""},{"0":"2019-08-14","1":"2019-08-14","2":"ZAKUP PRZY UŻYCIU KARTY","3":"McDonalds          /Nowy Targ                                         DATA TRANSAKCJI: 2019-08-12","4":"  ","5":"''","6":"-14,40","7":"1 228,01","8":""},{"0":"2019-08-14","1":"2019-08-14","2":"ZAKUP PRZY UŻYCIU KARTY","3":"JMP S.A. BIEDRONKA /RABKA-ZDRO                                        DATA TRANSAKCJI: 2019-08-12","4":"  ","5":"''","6":"-25,34","7":"1 202,67","8":""},{"0":"2019-08-15","1":"2019-08-15","2":"BLIK ZAKUP E-COMMERCE","3":"ALLEGRO.PL SP. Z O.O.","4":"  ","5":"''","6":"-40,37","7":"1 162,30","8":""},{"0":"2019-08-16","1":"2019-08-16","2":"BLIK ZAKUP E-COMMERCE","3":"PAYPRO S.A.","4":"  ","5":"''","6":"-20,00","7":"1 142,30","8":""},{"0":"2019-08-17","1":"2019-08-17","2":"BLIK ZAKUP E-COMMERCE","3":"PAYU","4":"  ","5":"''","6":"-135,98","7":"1 006,32","8":""},{"0":"2019-08-17","1":"2019-08-17","2":"BLIK ZAKUP E-COMMERCE","3":"ALLEGRO.PL SP. Z O.O.","4":"  ","5":"''","6":"-40,00","7":"966,32","8":""},{"0":"2019-08-17","1":"2019-08-17","2":"BLIK ZAKUP E-COMMERCE","3":"ALLEGRO.PL SP. Z O.O.","4":"  ","5":"''","6":"-13,80","7":"952,52","8":""},{"0":"2019-08-19","1":"2019-08-19","2":"ZAKUP PRZY UŻYCIU KARTY","3":"JMP S.A. BIEDRONKA /NOWY TARG                                         DATA TRANSAKCJI: 2019-08-17","4":"  ","5":"''","6":"-10,16","7":"942,36","8":""},{"0":"2019-08-25","1":"2019-08-25","2":"PRZELEW MTRANSFER WYCHODZACY","3":"P24-B72-M83-A30 WWW.FRU.PL","4":"PAYPRO SPÓŁKA AKCYJNA  UL.KANCLERSKA 15                   60-327 POZNAŃ POLSKA","5":"'76114020040000340277288431'","6":"-444,54","7":"497,82","8":""},{"0":"2019-08-26","1":"2019-08-26","2":"BLIK ZAKUP E-COMMERCE","3":"WWW.ALLEGRO.PL","4":"  ","5":"''","6":"-16,99","7":"480,83","8":""},{"0":""},{"0":""},{"0":"","1":"","2":"","3":"","4":"","5":"","6":"#Saldo końcowe","7":"480,83 PLN","8":""},{"0":""},{"0":"Niniejszy dokument sporządzono na podstawie art. 7 Ustawy Prawo Bankowe (Dz. U. Nr 140 z 1997 roku, poz.939 z późniejszymi zmianami)."}]`))
// let name = 'stan_na_miesiac';
// allElement[name] = {};
// allElement[name].data = new Data(name,name,`api/wydatki/${name}/query`)
// allElement[name].graph = new Graph(allElement[name].data,config_stan_na_miesiac);

// let name = 'stan_na_miesiac';
// allElement[name] = {};
// allElement[name].data = new Data(name,name,`api/wydatki/${name}/query`)
// allElement[name].graph = new Graph(allElement[name].data);


let name = 'wydatki';
allElement[name] = {};
allElement[name].data = new Data(name,name);
allElement[name].table = new Table(allElement[name].data,1);
actualData = allElement[name];

// const tabelka = new Tabelka("wydatki","wydatki"); //głowna tabelka main z wszystkimi wydatkami
// tabelka.adres += 'api/'+tabelka.sql_table+"/query";
// -------------------------------------------KONIEC MAIN----------------------

let checkBootstrapSizeMode = (event) => {
  let temp;
  if (window.getComputedStyle(document.querySelector('.device-xs')).display != 'none') temp = 'xs';
  if (window.getComputedStyle(document.querySelector('.device-sm')).display != 'none') temp = 'sm';
  if (window.getComputedStyle(document.querySelector('.device-md')).display != 'none') temp = 'md';
  if (window.getComputedStyle(document.querySelector('.device-lg')).display != 'none') temp = 'lg';
  return temp;
};

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
  rules.gdzie = {title: 'Gdzie',required:{required:true,message:m.required},min:{min:2,message:m.min}};
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
  let body = '';
  if (typeof obiekt == 'string') body = obiekt;
  else body = JSON.stringify(obiekt);

  return fetch(adres, {
        method: "post",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: body
    })
    .then(resp => resp.json())
  }

function formatujDate(date){
const data = new Date(date);
return leadingZero(data.getFullYear()) + "-" + leadingZero(data.getMonth()+1) + "-" + leadingZero(data.getDate());
}

function leadingZero(i) {
  return (i < 10)? '0'+i : i;
}

function wyloguj()
{
  fetch(uri+"logout");
  location.href = '/'
}

function getJson(adres,ob)
{
  return fetch(adres+'?'+getUrlString(ob)).then(resp => resp.json())
}

function getUrlString ( obj, keys = [], isArray = false) {
const params = {};
Object.assign(params, obj);
Object.keys(params).map(key => {
  if (typeof params[key] === 'object'){
    if (Object.keys(params[key]).length === 0) delete params[key]
  }
})

// console.log(params);
  const p = Object.keys(params).map(key => {
    let val = params[key]

    if ("[object Object]" === Object.prototype.toString.call(val) || Array.isArray(val)) {
      if (Array.isArray(params)) {
        keys.push("")
      } else {
        keys.push(key)
      }
      return getUrlString( val, keys, Array.isArray(val))
    } else {
      let tKey = key

      if (keys.length > 0) {
        const tKeys = isArray ? keys : [...keys, key]
        tKey = tKeys.reduce((str, k) => { return "" === str ? k : encodeURIComponent(`${str}[${k}]`) }, "")
      }
      if (isArray) {
        return `${ tKey }[]=${ val }`
      } else {
        return `${ tKey }=${ val }`
      }

    }
  }).join('&')

  keys.pop()
  return p;
}

function docReady(cb) {
  if (document.readyState != 'loading'){
    cb();
  } else {
    document.addEventListener('DOMContentLoaded', cb);
  }
}


function getClossestTag(el,tag){
  while (el.tagName !== tag.toUpperCase()){
    el = el.parentNode;
    if (typeof el === 'undefined' || el === null || el === document) return document.createElement('p');
  }
  return el;
}

function getClossestClass(el,klasa){
  while (!el.classList.contains(klasa)){
    el = el.parentNode;
    if (typeof el === 'undefined' || el === null || el === document) return document.createElement('p');
  }
  return el;
}
