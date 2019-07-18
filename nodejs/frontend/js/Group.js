class Group{
 constructor(table) {
    this.table = table;
    this.el = {}; //zawiera wszystkie checkboxy
    this.obj = {};//wartości checkboxow
    this.kolumn = [];
    this.pobierzNazwyKolumn()
    //this.generujHTML();
  }

  pobierzNazwyKolumn(){
    getJson('/api/wydatki/columns').then(res =>{
      res.forEach( el => {
        this.kolumn.push(el.column_name.toLowerCase());
        });
        this.generujHTML()
    }).catch( er => console.error(er))
    }

    generujHTML(){
    console.log('thiskolumn: ',this.kolumn);
    this.el.groupDiv = document.querySelector('.divGroup');
    console.log(this.el.groupDiv);

    this.el.select = document.createElement('select');
    this.el.select.setAttribute('multiple','');
    this.el.select.classList.add('form-control');
    this.el.select.addEventListener('blur', e => {
      const temp = [];
      Array.prototype.forEach.call(e.target.selectedOptions, el => {
        temp.push(el.value);
      })
      console.log('temp ', temp);
      this.table.data.param.groupby = temp;
      this.table.reload();
    })

    this.kolumn.forEach(el => {

    const option = document.createElement('option');
    option.innerText = el;
    this.el.select.appendChild(option);
  });

    this.el.groupDiv.appendChild(this.el.select);
  }
}
