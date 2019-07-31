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
let aktualna_tabelka = null; // zawiera wksaźnik do tabelki ktora jest aktualnie wyswietlana uzytkownikowi
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
allElement[name].table = new Table(allElement[name].data);

// const tabelka = new Tabelka("wydatki","wydatki"); //głowna tabelka main z wszystkimi wydatkami
// tabelka.adres += 'api/'+tabelka.sql_table+"/query";
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
