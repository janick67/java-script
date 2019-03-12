const express = require('express');
const mysql = require('mysql');
const cors = require('cors')
const path = require('path');
const bourbon = require('bourbon');
const approve = require('approvejs');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(__dirname + '/frontend/'));

const db = mysql.createConnection({
  host    : 'localhost',
  user    : 'janick67',
  password: 'janick67a',
  database: 'jw_wydatki'
})

db.connect((err) => {
  if(err) throw err;
  console.log('MySql Connected...');
});

app.get('/api/wydatki/query',(req,res) => {
  if (req.query.table !== "wydatki") return res.send("wybrano zła tabele");
  delete req.query.table;
  let sql = 'Select * from wydatki';
  let where = ' where 1';
  let limit = ' Limit';
  let orderby = ' order by ';
  const param = req.query;
  const name = Object.getOwnPropertyNames(param);
  //console.log( name,param[name[0]]);
 for (const el of name){
    if (el === 'limit'){
      limit += ' '+param[el];
    }else if(el === 'offset'){
      limit += ' offset '+param[el];
    }else if(el === 'orderby'){
      let order = param[el];
      console.log(order);
      order.forEach((element,i) =>{
        console.log("el",element, i);
        if (element[0] === '!') element = element.slice(1) + ' desc';
        if (i > 0) element = ', '+element;
        orderby += element;
      });
    }else if(el === 'data' || el === 'kwota'){
      where += ' and ' + el + ' = "' + param[el] + '" ';
    }else{
      if(param[el].indexOf(";") > -1) param[el] = param[el].replace(/;/g,'","');
      where += ' and ' + el+' in ("'+param[el]+'") ';
    }
    };
  sql += where; // dopisane cos wiecej niz samo where więc dodajemy do sql
  if (orderby.length > 10) sql += orderby;
  if (limit.length > 6) sql += limit; //jw
  console.log(sql);
  const query = db.query(sql, (err, result) => {
    if (err){console.error(err);  return res.send(err)};
    res.send(result);
  });
});


app.post('/api/wydatki', (req,res) => {
  //console.log("body: ",req.body);
  let  body = req.body;
  const spr = sprawdz(body);
  console.log('spr: ', spr, 'length: ', Object.keys(spr).length);
  if (Object.keys(spr).length > 0) return res.send({error:'Błędne dane',message:spr});

  const sql = 'INSERT INTO wydatki SET ?';
  const query = db.query(sql,body, (err, result) => {
    if (err) {
      console.error(err);
      return res.send(err);
    }
    res.send({id:result.insertId});
  })
})


app.listen(3000, () => console.log('Listen on port 3000...'))


function sprawdz(dane){
  const rules = {};
  rules.bank = {
    title: 'Bank',
    required: true,
    min: 3
  };

  rules.kwota = {
    title: 'Kwota',
    required: true,
    currency: true
  };

  rules.data = {
    title: 'Data',
    required: true,
    date: 'ymd'
  };

  rules.typ = {
    title: 'Typ',
    required: true,
    min: 3
  };

  rules.typ2 = {
    title: 'Typ2',
    required: true,
    min: 3
  };

  rules.gdzie = {
    title: 'Gdzie',
    required: true,
    min: 3
  };

  rules.kogo = {
    title: 'Kogo',
    required: true,
    min: 3
  };

  rules.osoba = {
    title: 'Osoba'
  };

  rules.powiazane = {
    title: 'Powiązane'
  };

  rules.opis = {
    title: 'Opis',
  };

  console.log('deb: rules ',rules);
  const errors = {};
  for (const el in rules){
    if (typeof rules[el] === 'undefined') continue;
    const aprv = approve.value(dane[el], rules[el])
    if (!aprv.approved){
      console.log('aprv: ',aprv);
      errors[el] = aprv.errors;
    }
  }
  return errors;
}
