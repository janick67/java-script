class Data{
  constructor(id, name, address, table){
    this.param = {};
    if (typeof id === 'undefined') this.id = 'wydatki'; else this.id = id;  // deklaracja wartosci domyślnej
    if (typeof name === 'undefined') this.name = id; else this.name = name;
    if (typeof table === 'undefined') this.param.table = "wydatki"; else this.param.table = table;
    if (typeof address === 'undefined') this.address = uri + "api/"+this.param.table+"/query"; else this.address = uri + address;

    this.param.limit = 5;
    this.param.offset = 0;
    this.param.orderby=[];
    this.param.where={}; //objekt w którym przechowywane są wszystkie parametry wysyłane później w zapytaniu sql // od początku tworzę tablice na sortowanie
    this.resp={}; // odpowiedz serwera w json
    this.load();
  }

  load(){
    console.log(this.address,this.param);
    getJson(this.address,this.param) // pobiera dane z serwera
    .then(resp => {
      this.resp = resp;
    })
    .catch(err => {
      console.log(err)
      console.log("Przekierowywuje do logowania");
    //  window.location.href = uri + 'logowanie/index.html';
    });
  }

}
