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

const data = new Date();

const db = mysql.createConnection({
  host    : 'localhost',
  user    : 'janick67',
  password: 'janick67a',
  database: 'jw_wydatki'
})

db.connect((err) => {
  if(err) throw err;
  console.log(aktualnaData()+'MySql Connected...');
});

app.get('/api/wydatki/query',(req,res) => {
  response(req,res, obj => {});
});

//------------------------------------------------------------------------------------------------
//SELECT sum(kwota) FROM `wydatki` WHERE bank = 'PKO' or bank = 'BGZ' or bank = 'OPT' or bank = 'GOT' or bank = 'MBA' or bank = 'DOM' or bank = 'inne'
app.get('/api/wydatki/saldo/query',(req,res) => {
  response(req,res, obj => {
    obj.select = 'sum(kwota)';
  });
});

  // `SELECT Year(data), MONTH(data), sum(kwota) FROM wydatki WHERE kogo = 'moje' GROUP BY Year(data), MONTH(data) order by Year(data), MONTH(data)`;
app.get('/api/wydatki/saldo_na_miesiac/query',(req,res) => {
  response(req,res, obj => {
    if (typeof obj.select === 'undefined') obj.select = '';
    if (typeof obj.where === 'undefined') obj.where = '';
    if (typeof obj.groupby === 'undefined') obj.groupby = '';
    if (typeof obj.orderby === 'undefined') obj.orderby = 'Year(data), MONTH(data)';
    obj.select += 'Year(data), MONTH(data), sum(kwota)';
    obj.where += 'and kogo = "moje"';
    obj.groupby += 'Year(data), MONTH(data)';
  });
});

//SELECT * FROM `wydatki` WHERE powiązane = 0 and kogo not like 'inne' and kogo not like 'moje' and data > '2018-09-01'
app.get('/api/wydatki/kto_ma_oddac/query',(req,res) => {
  response(req,res, obj => {
    if (typeof obj.where === 'undefined') obj.where = '';
    if (typeof obj.orderby === 'undefined') obj.orderby = 'kogo';
    obj.where += 'and powiazane = 0 and kogo not like "inne" and kogo not like "moje" and data > "2018-09-01"';
  });
});

//SELECT kogo, sum(kwota) FROM `wydatki` WHERE powiązane = 0 and kogo not like 'inne' and kogo not like 'moje' and data > '2018-09-01' group by kogo
app.get('/api/wydatki/kto_ma_oddac_suma/query',(req,res) => {
  response(req,res, obj => {
    if (typeof obj.select === 'undefined') obj.select = '';
    if (typeof obj.where === 'undefined') obj.where = '';
    if (typeof obj.groupby === 'undefined') obj.groupby = '';
    if (typeof obj.orderby === 'undefined') obj.orderby = 'Year(data), MONTH(data)';
    obj.select += 'kogo, sum(kwota)';
    obj.where += 'and powiazane = 0 and kogo not like "inne" and kogo not like "moje" and data > "2018-09-01"';
    obj.groupby += 'kogo';
  });
});

app.post('/api/wydatki', (req,res) => {
  let  body = req.body;
  const spr = sprawdz(body);
  if (Object.keys(spr).length > 0) return res.send({error:'Błędne dane',message:spr});
  const sql = 'INSERT INTO wydatki SET ?';
  const query = db.query(sql,body, (err, result) => {
    if (err) {
      console.error(aktualnaData()+err);
      return res.send(err);
    }
    res.send({id:result.insertId});
  })
})



app.listen(3001, () => console.log(aktualnaData()+'Listen on port 3001....'))



function generujSql(obj){
  if (typeof obj.select === 'undefined') obj.select = '*';

  if (typeof obj.where === 'undefined') {
    obj.where = '';
  }else{
    obj.where = 'where 1 ' + obj.where;
  }

  if (typeof obj.orderby === 'undefined' || obj.orderby.length < 2) {
    obj.orderby = '';
  }else{
    obj.orderby = 'order by ' + obj.orderby;
  }

  if (typeof obj.groupby === 'undefined') {
    obj.groupby = '';
  }else{
    obj.groupby = 'group by ' + obj.groupby;
  }

  if (typeof obj.limit === 'undefined') {
    obj.limit = '';
  }else{
    obj.limit = 'limit ' + obj.limit;
  }

  if (typeof obj.offset === 'undefined'){
    obj.offset = '';
  }else{
    obj.offset = 'offset ' + obj.offset;
  }

  if (typeof obj.from === 'undefined') obj.from = 'wydatki';

  let sql = `SELECT ${obj.select} from ${obj.from} ${obj.where} ${obj.groupby} ${obj.orderby} ${obj.limit} ${obj.offset}`;
  console.log(aktualnaData()+sql);
  return sql;
}

function response(req,res,func)
{
  if (req.query.table !== "wydatki") return res.send("wybrano zła tabele");
  delete req.query.table;
  const param = req.query;
  const obj = param;

  if (typeof obj.orderby !== 'undefined'){
    obj.orderby = decodeOrderby(obj.orderby);
  }

  if (typeof obj.where !== 'undefined'){
    obj.where = decodeWhere(obj.where);
  }

  if (typeof func !== undefined) func(obj);

  let sql = generujSql(obj);
  const query = db.query(sql, (err, result) => {
    console.log(result);
    if (err){console.error(err);  return res.send(err)};
    res.send(result);
  });
}

function rules(){
  const m = {required:'Pole {title} jest wymagane.',
  min:'Wymagane przynajmniej {min} znaki.',
  cur:'Podaj prawidłową wartosc',
  data:'Podaj prawidłową date'};
  const rules = {};
  rules.bank = {title: 'Bank',required:{required:true,message:m.required},min:{min:3,message:m.min}};
  rules.kwota = {title: 'Kwota',required:{required:true,message:m.required},currency:{currency:true,message:m.cur}};
  rules.data = {title: 'Data',required:{required:true,message:m.required},date:{format:'ymd',message:m.data},min:{min:3,message:m.min}};
  rules.typ = {title: 'Typ',required:{required:true,message:m.required},min:{min:3,message:m.min}};
  rules.typ2 = {title: 'Typ2',required:{required:true,message:m.required},min:{min:3,message:m.min}};
  rules.gdzie = {title: 'Gdzie',required:{required:true,message:m.required},min:{min:3,message:m.min}};
  rules.kogo = {title: 'Kogo',required:{required:true,message:m.required},min:{min:3,message:m.min}};
  rules.osoba = {title: 'Osoba'};
  rules.powiazane = {title: 'Powiązane'};
  rules.opis = {title: 'Opis'};
  return rules;
}

function sprawdz(dane){
  const rule = rules();
  const errors = {};
  for (const el in rule){
    if (typeof rule[el] === 'undefined') continue;
    const aprv = approve.value(dane[el], rule[el])
    if (!aprv.approved){
      errors[el] = aprv.errors;
    }
  }
  return errors;
}

function aktualnaData(){
  const rok = leadingZero(data.getFullYear());
  const miesiac = leadingZero(data.getMonth()+1);
  const dzien = leadingZero(data.getDate());
  const godz = leadingZero(data.getHours());
  const min = leadingZero(data.getMinutes());
  const sec = leadingZero(data.getSeconds());
  return `[${dzien}.${miesiac}.${rok} ${godz}:${min}:${sec}] `
}

function leadingZero(i) {
  return (i < 10)? '0'+i : i;
}
