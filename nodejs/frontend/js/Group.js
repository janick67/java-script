//$('select').selectpicker();
console.log('tutaj');

class Group{
  constructor(table) {
    this.table = table;
    this.el = {}; //zawiera wszystkie checkboxy
    this.obj = {};//wartości checkboxow
    this.kolumn = [];
    this.pobierzNazwyKolumn();
    this.generujHTML();
  }

  pobierzNazwyKolumn(){
    Array.prototype.forEach.call(this.table.el.trHeader.querySelectorAll('th'), el => {
    this.kolumn.push(el.className.toLowerCase());
    });

  }

  generujHTML(){
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
      this.table.object.group = temp;
      this.table.odswiez();
    })

    this.kolumn.forEach(el => {
    const option = document.createElement('option');
    option.innerText = el;
    this.el.select.appendChild(option);
  });

    this.el.groupDiv.appendChild(this.el.select);
  }
}
