
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
  it.odswiez();
});

$('#saldo').click(function(){
  const tab_saldo = new Tabelka("wydatki","wydatki");
  tab_saldo.adres += 'api/wydatki/saldo/query';
  tab_saldo.init();
  });

$('#saldo_na_miesiac').click(function(){
    const tab_saldo = new Tabelka("wydatki","wydatki");
    tab_saldo.adres += 'api/wydatki/saldo_na_miesiac/query';
    tab_saldo.init();
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
  kliknieta_tabelka.filtr.ustaw(e.target);
});


//----------------------------------------------EVENTY KONIEC-----------------------
