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
  const param = req.query;
  const name = Object.getOwnPropertyNames(param);
  //console.log( name,param[name[0]]);
 for (const el of name){
    if (el === 'limit'){
      limit += ' '+param[el];
    }else if(el === 'offset'){
      limit += ' offset '+param[el];
    }else if(el === 'data' || el === 'kwota'){
      where += ' and ' + el + ' = "' + param[el] + '" ';
    }else{
      if(param[el].indexOf(";") > -1) param[el] = param[el].replace(/;/g,'","');
      where += ' and ' + el+' in ("'+param[el]+'") ';
    }
    };
  if (limit.length <= 6) limit = ''; // nie ma nic dopisanego wiec usuwam
  let sql = `Select * from wydatki where 1 ${where} ${limit}`;
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

/*
app.get('/api/test/:id', (req,res) => {
  console.log("Jestes tu : :id ");
 console.log(req.body);
  const sql = `Select * from test where id = ${req.params.id}`;
  const query = db.query(sql, (err, result) => {
    if (err){console.error(err);  return res.send(err)};
    res.send(result);
  });
}) ;

app.get('/log/node/:code', (req,res) => {
  let kod = req.params.code;
  if (!(kod.length === 8 && kod[0] == '1' && kod[1] == '6')) return;

 const sql = `Select nazwa from kody where code = "${kod}"`;
 const query = db.query(sql, (err, result) => {
   if (err) return console.log(err);
   console.log(result[0].nazwa);
 });
}) ;

app.get('/api/test', (req,res) => {
  const sql = `Select * from test`;
  const query = db.query(sql, (err, result) => {
    if (err) return res.send(err);
    res.send(result);
  });
}) ;

app.post('/api/test', (req,res) => {
  console.log("jeste tu : post json");
  console.log(req);
  if (req.body.imie == undefined) return res.send("Pusty JSON");
  const body = {
    imie:       req.body.imie,
    nazwisko:   req.body.nazwisko,
    pensja:     req.body.pensja
  };

  console.log(body);
  const sql = 'INSERT INTO test SET ?';
  const query = db.query(sql,body, (err, result) => {
    if (err) return res.send(err);
    res.send(result);
  })
})

app.post('/api/sql', (req,res) => {
  const query = db.query(req.body.sql, (err, result) => {
    if (err){console.error(err);  return res.send(err)};
    res.send(result);
  })
});

app.get('/api/wydatki/stan_konta', (req,res) => {
  const sql = "SELECT sum(kwota) as 'Stan konta' FROM `wydatki` WHERE bank = 'PKO' or bank = 'BGZ' or bank = 'OPT' or bank = 'GOT' or bank = 'MBA' or bank = 'DOM' or bank = 'inne'";
  const query = db.query(sql, (err, result) => {
    if (err){console.error(err);  return res.send(err)};
    res.send(result);
  });
});

app.get('/api/wydatki', (req,res) => {
  console.log(req.query);
  const sql = "SELECT * from wydatki Limit 10";
  const query = db.query(sql, (err, result) => {
    if (err){console.error(err);  return res.send(err)};
    res.send(result);
  });
});

app.get('/api/wydatki/query',(req,res) => {
  if (req.query.table !== "wydatki") return res.send("wybrano zła tabele");
  delete req.query.table;
  let sql = 'Select * from wydatki';
  let where = ' where 1';
  let limit = ' Limit';
  const param = req.query;
  const name = Object.getOwnPropertyNames(param);
  //console.log( name,param[name[0]]);
 for (const el of name){
    if (el === 'limit'){
      limit += ' '+param[el];
    }else if(el === 'offset'){
      limit += ' offset '+param[el];
    }else if(el === 'data' || el === 'kwota'){
      where += ' and ' + el + ' ' + param[el] + ' ';
    }else{
      if(param[el].indexOf(";") > -1) param[el] = param[el].replace(/;/g,'","');
      where += ' and ' + el+' in ("'+param[el]+'") ';
    }
    };
  sql += where; // dopisane cos wiecej niz samo where więc dodajemy do sql
  if (limit.length > 6) sql += limit; //jw
  console.log(sql);
  const query = db.query(sql, (err, result) => {
    if (err){console.error(err);  return res.send(err)};
    res.send(result);
  });
});

app.get('/api/wydatki/limit/:limit/:offset', (req,res) => {
  const sql = `SELECT * from wydatki Limit ${req.params.limit} offset ${req.params.offset}`;
  const query = db.query(sql, (err, result) => {
    if (err){console.error(err);  return res.send(err)};
    res.send(result);
  });
});

app.get('/api/wydatki/saldo_na_miesiac', (req,res) => {
  const sql = "SELECT Year(data), MONTH(data), sum(kwota) FROM `wydatki` WHERE kogo = 'moje' GROUP BY Year(data), MONTH(data) order by Year(data), MONTH(data)";
  const query = db.query(sql, (err, result) => {
    if (err){console.error(err);  return res.send(err)};
    res.send(result);
  });
});

app.get('/api/wydatki/saldo_na_miesiac/:year/:month', (req,res) => {
  let year = req.params.year;
  let month = req.params.month;
  if (year === '0') year = 'YEAR(data)';
  if (month === '0') month = 'MONTH(data)';

  const sql = `SELECT Year(data), MONTH(data), sum(kwota) FROM wydatki WHERE kogo = 'moje' and Year(data) = ${year} and MONTH(data) = ${month} GROUP BY Year(data), MONTH(data) order by Year(data), MONTH(data)`;
  console.log(sql);
  const query = db.query(sql, (err, result) => {
    if (err){console.error(err);  return res.send(err)};
    res.send(result);
  });
});
*/
