
//---------------------------------------------EVENTY------------------------------


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


window.addEventListener('popstate', e => {
    console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
})
//----------------------------------------------EVENTY KONIEC-----------------------
