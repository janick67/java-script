function Insert(){
  this.all = {};  //wszystkie rekordy prosto po pobraniu z bazy
  this.kolumn = {}; //w obiekcie są zapisane inputy, ich wartości, sugerowane wartosci w inputach
  this.wygenerowane = 0;
}


Insert.prototype.init = function(){
  $.getJSON("/api/wydatki/query",{table: 'wydatki'}) // pobiera dane z serwera
  .done(resp => {
    this.all = resp;  //odpowiedz jest w formie tablicy obiektów(nazwa kolumny: wartośc)
    this.wygenerowane = 1;
    this.generujProponowane();  //generuje i zapisuje do obiektu this.kolumn[el].proponowane
    this.przygotujInputy(); //dodaje klasy, dataliste z podpowiedziami i datapickera dla inputa data
  }).fail(err => console.log(err));
}

Insert.prototype.przygotujInputy = function(){ //dodaje klasy, dataliste z podpowiedziami i tworzy datapickera
  for (const kol in this.kolumn){
    const id = 'add_'+kol; // kol to nazwa kolumny z bazy pisana małymi literami
    const $input = $(`#${id}`)
    $input.addClass(kol);   //dodaje klasy do inputów o takiej wartości jak nazwa kolumny
    $input.attr('list',`${id}_list`); //podpina datalist pod inputa tak żeby podpowiadały się wartości
    const $datalist = $(`<datalist id="${id}_list">`); //tworzy dataliste do każdego inputa z podpowiedziami
    this.kolumn[kol].proponowane.forEach(el => {  //tworzy wartości do datalisty i dodaje je do niej
      $option = $(`<option value=${el}>`);
      $datalist.append($option);
    });
    this.kolumn[kol].input = $input; //dodaje inputa do obiektu w którym są jeszcze wartości i domyślne wartości
    $input.after($datalist);  //dodaje datalistę po inpucie w htmlu
    if (kol === 'data') $input.datepicker({ dateFormat: 'yy-mm-dd'}) // dla daty dodaję jeszcze okienko modalne pozwalające wybrac date
  }
}

Insert.prototype.generujProponowane = function(){ //robi pętle po wszystkich rekordach z bazy i robi tak jakby distincta
  if (this.wygenerowane === 0) return this.generujObiekt(); // jeśli obiekt jeszcze nie jest wygenerowany to wygeneruj
  console.log(this.all[0]);
  Object.getOwnPropertyNames(this.all[0]).forEach(el => { // wypełnia nazwami kolumn pisanymi małymi literami obiekt kolumn w którym później będą wszystkie dane odnosnie inputów
     this.kolumn[el.toLowerCase()] = {proponowane:[]};
  })
  this.all.forEach(row => { //pętla po wszystkich zwróconych rekordach z bazy
    for (const el in this.kolumn){  //w każdym rekordzie pętla po wszyskich jego kolumnach
      let {proponowane} = this.kolumn[el];  // destrukturyzacja
      if (el !== 'id' && el !== 'data' && el !== 'kwota' && el !== 'powiazane' && el !== 'opis'){ // dla tych pól nie są podpowiadane żadne wartości
        if (typeof row[el] !== 'undefined' && row[el] !== null && row[el] !== '')  //dla pustych wartości nie robimy nic
            if (proponowane.indexOf(row[el]) === -1) proponowane.push(row[el]);// jeśli nie ma jeszcze takiego rekordu to wrzucamy na koniec tablicy
      }else{
        proponowane = null; // jeśli to jest jedna z wyżej wymienionych kolumn i nie potrzebuje podpowiedzi to przypisujemy nulla
  }}});}

Insert.prototype.wyczysc = function(){//czysci wszystkie inputy ich klasy i obiekt
  $('#dodaj input').each((i,el) =>{
    const kol = this.kolumn[el.classList[0]]; // upraszczam zapis
    kol.value = ''; //zeruje wartośc wpisana do obiektu
    el.value = '';  //zeruje wartosc wpisana do inputa
    $('#dodaj span.error').remove(); //usuwa wszystkie stare komunikaty o błędach
    kol.input.removeClass('bad_value'); //usuwam klasy, ktore zmienialy wyglad inpotow, skoro czyszcze to juz takie oznaczenia nie sa potrzebne
    kol.input.removeClass('good_value');
  });
}

Insert.prototype.czytajIWyslij = function(){ // wczytuje dane z imputów, wysyła do walidacji i później je wysyła i obsługuje odpowiedź
  $('#dodaj input').each((i,e) =>{
    this.kolumn[e.name].value = e.value;  //pętla po wszystkich inputach, zczytuje ich wartości i wrzuca do obiektu kolumn
  });
  const obj = {}; // obiekt w którym będą wartości wszystkich pól i po walidacji zostanie wysłany do serwera
  for (const el in this.kolumn){ //pętla po wszystkich kolumnach
    const {value} = this.kolumn[el]; // destrukturyzacja
    if (typeof value !== 'undefined') obj[el] = value; //przypisanie wartości z inputa do obiektu
  }
  if (this.sprawdz(obj) == 1){  // walidacja przed wysłaniem na serwer
      send_insert(uri+"api/wydatki",obj) //jeśli jest ok to wysyłam
      .then(res => { //sprawdzam odpowiedz bo to że jest to jeszcze nie znaczy że jest dobra
        if (typeof res.id !== 'undefined' && res.id > -1){  //jeśli serwer zwrócił nam id nowo dodanego rekordu to jest ok
          location.reload();
          this.wyczysc(); //czyszczę bo jak już dodane to nie trzeba mi już tych danych
        }else{console.error(res);}
      }).fail(err => console.error(err))
  }else{
  console.error("Błędnie wypełniono, popraw błędy i wyślij ponownie!")}
}

Insert.prototype.toggle = function(){ // pokazuje i chowa diva z wprowadzaniem
  if (Insert.wygenerowane === 0) Insert.init();
  $('#dodaj').slideToggle();
}

Insert.prototype.sprawdz = function(obj){ // wysyła dane do walidacji i wyswietal poźniej stosowne informacje o błędzie, zwraca 1 jeśli wszystko jest ok i 0 gdy coś się nie powiodło
  const err = sprawdz(obj);// waliduje dane zwraca 1 gdy ok i 0 gdy nie
  $('#dodaj div.invalid-feedback').remove(); //usuwa wszystkie stare komunikaty o błędach
  for (const el in this.kolumn){ // pętla po wszystkich kolumnach
    const {input} = this.kolumn[el];
    if (input.length === 0) continue;  // jesli nie zawiera inputow to nie ma co sprawdzac
    if (typeof err[el] === 'undefined') { // jeśli nie ma błędow dla tego elementu to znaczy ze wszystko jest ok
      input.addClass(' is-valid'); //ustawia flagę informującą o powodzeniu i usuwa ewentualną o nie powodzeniu
      input.removeClass('is-invalid');
    }else{
      input.after($(`<div class="invalid-feedback">${err[el][0]}</div>`)); // dodaje diva pod inputem z informującą o błędzie
      input.addClass('is-invalid'); //usuwa dobrą dodaje klase informujaca o bledzie
      input.removeClass('is-valid');
    }
  }
  if (Object.keys(err).length > 0) return 0; //jeśli nie ma żadnych błędow to zwraca 1 i można wtedy wyslac dane
  return 1;
}
