
//---------------------------------------------EVENTY------------------------------

$('#next').on('click', function(){
  const it = aktualna_tabelka;
  it.strona++;
  it.object.offset = it.na_strone*(it.strona-1);
  it.odswiez();
});

$('#prev').on('click', function(){
  const it = aktualna_tabelka;
  it.strona--;
  it.object.offset = it.na_strone*(it.strona-1);
  it.odswiez();
});

$('#na_strone').on('change', function() {
  const it = aktualna_tabelka;
  it.na_strone = this.value;
  it.object.limit = it.na_strone;
  console.log(it);
  it.odswiez();
});

$('#btn_dodaj').click(e => {
  distinct.toggle();
});

$('#add_btn').click(e => {
  distinct.czytajIWyslij();
});

$('#btn_wyloguj').click(e => {
  wyloguj();
});


$('#wszystkie').click(function(){
  tabelka.pokaz();
});

$('#saldo').click(function(){
  const tab_saldo = new Tabelka("saldo","saldo");
  tab_saldo.adres += 'api/wydatki/saldo/query';
  tab_saldo.init();
});

$('#saldo_na_miesiac').click(function(){
    const tab_saldo = new Tabelka("saldo_na_miesiac","saldo_na_miesiac");
    tab_saldo.adres += 'api/wydatki/saldo_na_miesiac/query';
    tab_saldo.init();
});

$('#kto_ma_oddac').click(function(){
    const tab_kto_ma_oddac = new Tabelka("kto_ma_oddac","kto_ma_oddac");
    tab_kto_ma_oddac.adres += 'api/wydatki/kto_ma_oddac/query';
    tab_kto_ma_oddac.init();
});

$('#kto_ma_oddac_suma').click(function(){
    const tab_kto_ma_oddac_suma = new Tabelka("kto_ma_oddac_suma","kto_ma_oddac_suma");
    tab_kto_ma_oddac_suma.adres += 'api/wydatki/kto_ma_oddac_suma/query';
    tab_kto_ma_oddac_suma.init();
});

$('#btn_filter').click(function(){
  aktualna_tabelka.filtr.toggle();
  });

const $div_body = $('#body');


$div_body.on('mouseout', e => {
    $(e.target).closest('tr').removeClass("red");
    $(e.target).closest('td').removeClass("blue");
  });

$div_body.on('mouseover', e => {
  $(e.target).closest('tr').removeClass("red");
  $(e.target).closest('td').removeClass("blue");
  $(e.target).closest('tr').addClass("red");
  $(e.target).closest('td').addClass("blue");
});

$div_body.click( e => {
  const kliknieta_tabelka = $(e.target).closest('.divTable').data('obj');
  kliknieta_tabelka.filtr.ustaw(e.target);// do filtrowania według kliknietego

  if (e.target.tagName === 'SPAN' && e.target.parentElement.tagName === 'TH'  && e.offsetX > e.target.offsetWidth) {  //sprawdza klikniete bylo na obiekcie czy na prawo od niego jesli na prawo to znaczy ze to byl pseudo element bo jego nie ma w strukturze DOM
          kliknieta_tabelka.sortuj(e.target) //do sortowania według kliknietego
    }
});


//----------------------------------------------EVENTY KONIEC-----------------------
