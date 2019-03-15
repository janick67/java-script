const express = require('express');
const mysql = require('mysql');
const cors = require('cors')
const path = require('path');
const bourbon = require('bourbon');

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
    obj.where += 'and powiązane = 0 and kogo not like "inne" and kogo not like "moje" and data > "2018-09-01"';
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
    obj.where += 'and powiązane = 0 and kogo not like "inne" and kogo not like "moje" and data > "2018-09-01"';
    obj.groupby += 'kogo';
  });
});


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
  console.log(sql);
  return sql;
}

app.listen(3001, () => console.log('Listen on port 3001....'))



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
    if (err){console.error(err);  return res.send(err)};
    res.send(result);
  });
}

function decodeOrderby(obj)
{
  let order = obj;
  gotowy_obj = '';
  order.forEach((element,i) =>{
    if (element[0] === '!') element = element.slice(1) + ' desc';
    if (i > 0) element = ', '+element;
    gotowy_obj += element;
  });
  return gotowy_obj;
}

function decodeWhere(obj)
{
  let where = '';
    const name = Object.getOwnPropertyNames(obj);
    for (const el of name){
      if(obj[el].indexOf(";") > -1) obj[el] = obj[el].replace(/;/g,'","');
      where += ' and ' + el+' in ("'+obj[el]+'") ';
    }
  return where;
}
