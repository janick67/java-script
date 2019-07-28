
//---------------------------------------------EVENTY------------------------------


document.querySelector('#nav_group') //Przechodzi na strone z grupowaniem
.onclick = e =>  {
  e.preventDefault();
  let name = 'group';
  allElement[name].table = new Table(new Data(name,name,`api/wydatki/${name}/query`));
  tab_group = allElement[name].table;
  tab_group.el.group = document.createElement('div');
  tab_group.el.group.classList.add('divGroup');
  tab_group.el.mainDiv.insertBefore(tab_group.el.group,tab_group.el.divBody);
  setTimeout(()=>{
    tab_group.group = new Group(tab_group)
  },500);
}


document.querySelector('#add_btn') // w oknie modalnym
.onclick = e =>  {
  e.preventDefault();
  insert.czytajIWyslij();
}

document.querySelector('#nav_wyloguj')
.onclick = e =>  {
  e.preventDefault();
  wyloguj();
}

document.querySelector('#nav_wszystkie') // strona głowna
.onclick = e => {
  e.preventDefault();
  Table.pokaz();
}

document.querySelector('#nav_saldo')
.onclick = e =>{
  e.preventDefault();
  let name = 'saldo';
  allElement[name].table = new Table(new Data(name,name,`api/wydatki/${name}/query`));
}

document.querySelector('#nav_saldo_na_miesiac')
.onclick = e =>{
    e.preventDefault();
    let name = 'saldo_na_miesiac';
    allElement[name].table = new Table(new Data(name,name,`api/wydatki/${name}/query`));
  }

document.querySelector('#nav_stan_na_miesiac')
.onclick = e =>{
    e.preventDefault();
    let name = 'stan_na_miesiac';
    allElement[name].table = new Table(new Data(name,name,`api/wydatki/${name}/query`));
  }

document.querySelector('#nav_kto_ma_oddac')
.onclick = e =>{
    e.preventDefault();
    let name = 'kto_ma_oddac';
    allElement[name].table = new Table(new Data(name,name,`api/wydatki/${name}/query`));
}

document.querySelector('#nav_kto_ma_oddac_suma')
.onclick = e =>{
    e.preventDefault();
    let name = 'kto_ma_oddac_suma';
    allElement[name].table = new Table(new Data(name,name,`api/wydatki/${name}/query`));
}


window.addEventListener('popstate', e => {
    console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
})
//----------------------------------------------EVENTY KONIEC-----------------------
