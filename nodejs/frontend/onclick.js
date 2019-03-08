
//---------------------------------------------EVENTY------------------------------


const $btn_next = $('#next');
const $btn_prev = $('#prev');
const $select_na_strone = $('#na_strone');
const $btn_filter = $('#btn_filter');
const $div_body = $('#body');

$btn_next.on('click', function(){
  const it = aktualna_tabelka;
  it.strona++;
  it.object.offset = it.na_strone*(it.strona-1);
  it.odswiez();
});

$btn_prev.on('click', function(){
  const it = aktualna_tabelka;
  it.strona--;
  it.object.offset = it.na_strone*(it.strona-1);
  it.odswiez();
});

$select_na_strone.on('change', function() {
  const it = aktualna_tabelka;
  it.na_strone = this.value;
  it.object.limit = it.na_strone;
  it.odswiez();
});

$btn_filter.click(function(){
  aktualna_tabelka.filtr.toggle();
  });



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
