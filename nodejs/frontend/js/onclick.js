
//---------------------------------------------EVENTY------------------------------


document.querySelector('#next')
.onclick = e => aktualna_tabelka.zmienStrone(aktualna_tabelka.strona*1+1)


document.querySelector('#prev')
.onclick = e => aktualna_tabelka.zmienStrone(aktualna_tabelka.strona*1-1)

document.querySelector('#na_strone')
.addEventListener('change', e => {
  const it = aktualna_tabelka;
  it.na_strone = e.target.value;
  it.object.limit = it.na_strone;
  it.odswiez();
})

document.querySelector('#add_btn')
.onclick = e =>  {
  e.preventDefault();
  insert.czytajIWyslij();
}

document.querySelector('#btn_wyloguj')
.onclick = e =>  {
  e.preventDefault();
  wyloguj();
}

document.querySelector('#wszystkie')
.onclick = e => {
  e.preventDefault();
  tabelka.pokaz();
}


document.querySelector('#saldo')
.onclick = e =>{
  e.preventDefault();
  const tab_saldo = new Tabelka("saldo","saldo");
  tab_saldo.adres += 'api/wydatki/saldo/query';
  tab_saldo.init();
}

document.querySelector('#saldo_na_miesiac')
.onclick = e =>{
    e.preventDefault();
    const tab_saldo = new Tabelka("saldo_na_miesiac","saldo_na_miesiac");
    tab_saldo.adres += 'api/wydatki/saldo_na_miesiac/query';
    tab_saldo.init();
}

document.querySelector('#kto_ma_oddac')
.onclick = e =>{
    e.preventDefault();
    const tab_kto_ma_oddac = new Tabelka("kto_ma_oddac","kto_ma_oddac");
    tab_kto_ma_oddac.adres += 'api/wydatki/kto_ma_oddac/query';
    tab_kto_ma_oddac.init();
}

document.querySelector('#kto_ma_oddac_suma')
.onclick = e =>{
    e.preventDefault();
    const tab_kto_ma_oddac_suma = new Tabelka("kto_ma_oddac_suma","kto_ma_oddac_suma");
    tab_kto_ma_oddac_suma.adres += 'api/wydatki/kto_ma_oddac_suma/query';
    tab_kto_ma_oddac_suma.init();
}


const div_body = document.querySelector('#body')


div_body.addEventListener('mouseout', e => {
  getClossestTag(e.target,'tr').classList.remove('red');
  getClossestTag(e.target,'td').classList.remove('blue')
  });

div_body.addEventListener('mouseover', e => {
  getClossestTag(e.target,'tr').classList.add('red');
  getClossestTag(e.target,'td').classList.add('blue')
});

div_body.onclick = e => {
  console.log(getClossestClass(e.target, 'divTable'))
  const kliknieta_tabelka = $(e.target).closest('.divTable').data('obj');
  kliknieta_tabelka.filtr.ustaw(e.target);// do filtrowania według kliknietego

  if (e.target.tagName === 'SPAN' && e.target.parentElement.tagName === 'TH'  && e.offsetX > e.target.offsetWidth) {  //sprawdza klikniete bylo na obiekcie czy na prawo od niego jesli na prawo to znaczy ze to byl pseudo element bo jego nie ma w strukturze DOM
          kliknieta_tabelka.sortuj(e.target) //do sortowania według kliknietego
    }
}

document.querySelector('#strona').addEventListener('change', e => {
  aktualna_tabelka.zmienStrone(e.target.value);
});

window.addEventListener('popstate', e => {
    console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
})
//----------------------------------------------EVENTY KONIEC-----------------------

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
