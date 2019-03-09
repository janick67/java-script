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
  if (req.query.table !== "wydatki") return res.send("wybrano zła tabele");
  delete req.query.table;
  let limit = ' Limit';
  let where = '';
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
  if (limit.length <= 6) limit = ''; // nie ma nic dopisanego wiec usuwam
  if (orderby.length <= 10) limit = ''; // nie ma nic dopisanego wiec usuwam
  let sql = `Select * from wydatki where 1 ${where} ${orderby} ${limit}`;
  console.log(sql);
  const query = db.query(sql, (err, result) => {
    if (err){console.error(err);  return res.send(err)};
    res.send(result);
  });
});

//------------------------------------------------------------------------------------------------
//SELECT sum(kwota) FROM `wydatki` WHERE bank = 'PKO' or bank = 'BGZ' or bank = 'OPT' or bank = 'GOT' or bank = 'MBA' or bank = 'DOM' or bank = 'inne'
app.get('/api/wydatki/saldo/query',(req,res) => {
  let sql = `SELECT sum(kwota) as Saldo FROM wydatki`;
  console.log(sql);
  const query = db.query(sql, (err, result) => {
    if (err){console.error(err);  return res.send(err)};
    res.send(result);
  });
});

app.get('/api/wydatki/saldo_na_miesiac/query',(req,res) => {
  let sql = `SELECT Year(data), MONTH(data), sum(kwota) FROM wydatki WHERE kogo = 'moje' GROUP BY Year(data), MONTH(data) order by Year(data), MONTH(data)`;

  console.log(sql);
  const query = db.query(sql, (err, result) => {
    if (err){console.error(err);  return res.send(err)};
    res.send(result);
  });
});


app.listen(3000, () => console.log('Listen on port 3000...'))