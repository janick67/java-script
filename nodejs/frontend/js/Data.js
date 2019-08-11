class Data{
  constructor(id, name, address, table){
    this.param = {};
    if (typeof id === 'undefined') this.id = 'wydatki'; else this.id = id;  // deklaracja wartosci domyślnej
    if (typeof name === 'undefined') this.name = id; else this.name = name;
    if (typeof table === 'undefined') this.param.table = "wydatki"; else this.param.table = table;
    if (typeof address === 'undefined') this.address = uri + "api/"+this.param.table+"/query"; else this.address = uri + address;
    this.page = 1;
    this.param.limit = 5;
    this.param.offset = 0;
    this.param.orderby=[];
    this.param.where={}; //objekt w którym przechowywane są wszystkie parametry wysyłane później w zapytaniu sql // od początku tworzę tablice na sortowanie
    this.resp={}; // odpowiedz serwera w json
  }

  load(){
    // console.trace(this.address,this.param);
    return getJson(this.address,this.param) // pobiera dane z serwera
    .then(resp => {
      if(resp.code == 'ER_PARSE_ERROR'){
        console.error(resp);
        this.resp = '';
      }else{
        console.log(resp);
        this.resp = resp;
      }
    })
    .catch(err => {
      console.log(err)
      console.log("Przekierowywuje do logowania");
    });
  }

}
