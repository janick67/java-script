const express = require('express');
const mysql = require('mysql');
const cors = require('cors')
const path = require('path');
const bourbon = require('bourbon');
const approve = require('approvejs');
const uuid = require('uuid/v4');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const LocalStrategy = require('passport-local').Strategy;

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());

const data = new Date();

const db = mysql.createConnection({
  host    : 'localhost',
  user    : 'janick67',
  password: 'janick67a',
  database: 'wydatki'
})

db.connect((err) => {
  if(err) throw err;
  console.log(aktualnaData()+'MySql Connected...');
});



const sessionStore = new MySQLStore({
    expiration: 10800000,
    createDatabaseTable: true,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
}}}, db);

// configure passport.js to use the local strategy
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    console.log('Inside local strategy callback')
    db.query(`select * from users where email = "${email}"`,(err, result) => {
        if (err){return console.log(err)};
        const user = result[0];
        console.log('Użytkownik z Local: ',email, typeof email,password, typeof password);
        if (typeof user === 'undefined') {return done(true, false);}
        console.log('Użytkownik z bazy: ',user.email ,typeof user.email, user.password,typeof user.password);
        if(email == user.email && password == user.password) {
          console.log('Local strategy returned true')
          return done(false, user)
        }else{
console.log('Local strategy returned false')
          return done(true, false);
        }
      });
    }
));

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  //console.log('Inside serializeUser callback. User id is save to the session file store here')
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
//  console.log('Inside deserializeUser callback')
  //console.log(`The user id passport saved in the session file store is: ${id}`)
  db.query(`select * from users where id = "${id}"`, function (err, rows){
      //console.log('rows: ', rows);
        done(err, rows[0]);
  });
});

// add & configure middleware
app.use(session({
  genid: (req) => {
    console.log('Inside the session middleware')
  //  console.log(req.sessionID)
    return uuid() // use UUIDs for session IDs
  },
  store: sessionStore,
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    if (req.path.indexOf('.css') === -1 && req.path.indexOf('.js') === -1 ){
        console.log("\n\n\nścieżka: ", req.path);
        if (typeof req.user !== 'undefined') console.log("użytkownik: ", req.user.username);
        else console.log("Brak użytkownika");
        // console.log('-------------------------- session -----------------------------------------');
        // console.dir(req.sessionID);
        // console.log('------------------------------------------------------------------------------------');
        // console.log('-------------------------- cookies -----------------------------------------');
        // console.dir(req.cookies);
        // console.log('------------------------------------------------------------------------------------');
        // console.log('-------------------------- user -----------------------------------------');
        // console.dir(req.user);
        // console.log('------------------------------------------------------------------------------------');
    }
    next();
  });

  app.use(function(req, res, next) {
    if(typeof req.user === 'undefined' && req.path.indexOf('api/') >= 0){
      return res.status(404).send("Najpierw się zaloguj");
    }
    if (typeof req.user === 'undefined' && req.path.indexOf('/logowanie/') !== 0 && req.path.indexOf('/css/') !== 0 && req.path.indexOf('/js/') !== 0 && req.path.indexOf('/images/') !== 0  && req.path.indexOf('/favicon') !== 0 && req.path !== '/signin' && req.path !== '/signup')
      {
         console.log("Przekierowywuje Cie do logowania");
         return  res.redirect('logowanie/index.html');
      }
      if (typeof req.user !== 'undefined' && req.path.indexOf('/logowanie') !== -1)
      {
        console.log("Jestes juz zalogowany, po co sie logowac drugi raz?");
        return  res.redirect('/');
      }
      next();
  });

app.post('/signin', (req, res, next) => {
  console.log('Inside the new POST /login callback')
  passport.authenticate('local', (err, user, info) => {
    console.log("(err, user, info)",err, user, info);
    if (err || !user) return res.send("Nie udało się uwierzytelnic");
    //console.log('Inside passport.authenticate() callback');
    //console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
    ///console.log(`req.user: ${JSON.stringify(req.user)}`)
    req.login(user, (err) => {
      console.log('Inside req.login() callback')
      console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
      console.log(`req.user: ${JSON.stringify(req.user)}`);
      return res.send("Zalogowano pomyślnie");
    })
  })(req, res, next)
});

app.post('/signup', (req, res, next) => {
  let  body = req.body;
  const spr = sprawdzRejestracja(body);
  if (Object.keys(spr).length > 0) return res.send({error:'Błędne dane',message:spr});
  const sql = 'INSERT INTO users SET ?';
  const query = db.query(sql,body, (err, result) => {
    if (err) {
      console.error(err);
      return res.send(err);
    }
      return res.send('Zarejestrowano pomyślnie')
  })
});

app.get('/logout',(req, res) => {
  req.logout();
  res.send("ok");
  res.redirect('/');
});


function sprawdzRejestracja(body){
  return {};
}

app.get('/api/wydatki/query',(req,res) => {
  response(req,res, obj => {});
});

app.get('/api/wydatki/columns',(req,res) => {
  let sql = "SELECT column_name FROM information_schema.columns WHERE table_name='wydatki'";
  sendSql(res,sql);
});

//------------------------------------------------------------------------------------------------
//SELECT sum(kwota) FROM `wydatki` WHERE bank = 'PKO' or bank = 'BGZ' or bank = 'OPT' or bank = 'GOT' or bank = 'MBA' or bank = 'DOM' or bank = 'inne'
app.get('/api/wydatki/saldo/query',(req,res) => {
  response(req,res, obj => {
    obj.select = 'sum(kwota)';
  });
});

app.get('/api/wydatki/group/query',(req,res) => {
  response(req,res, obj => {
    if (typeof obj.select === 'undefined') obj.select = '';
    obj.select += 'sum(kwota) as kwota';
    if (typeof obj.groupby !== 'undefined') obj.select += ',' + obj.groupby;
  });
});

//SELECT b.miesiac, b.s_kwota, (SELECT sum(t.s_kwota) FROM (SELECT DATE_FORMAT(data, "%Y-%m") as miesiac, sum(kwota) as s_kwota FROM `wydatki` WHERE kogo = 'moje' GROUP BY DATE_FORMAT(data, "%Y-%m"))as t where t.miesiac <= b.miesiac) as sel FROM (SELECT DATE_FORMAT(data, "%Y-%m") as miesiac, sum(kwota) as s_kwota FROM `wydatki` WHERE kogo = 'moje' GROUP BY DATE_FORMAT(data, "%Y-%m")) as b order by 1,2
app.get('/api/wydatki/stan_na_miesiac/query',(req,res) => {
  response(req,res, obj => {
   //obj.sql = "SELECT b.miesiac, (SELECT sum(t.s_kwota) FROM (SELECT DATE_FORMAT(data, '%Y-%m-%d') as miesiac, sum(kwota) as s_kwota FROM `wydatki` WHERE kogo = 'moje' GROUP BY DATE_FORMAT(data, '%Y-%m-%d'))as t where t.miesiac <= b.miesiac) as sel FROM (SELECT DATE_FORMAT(data, '%Y-%m-%d') as miesiac, sum(kwota) as s_kwota FROM `wydatki` WHERE kogo = 'moje' GROUP BY DATE_FORMAT(data, '%Y-%m-%d')) as b order by 1,2";
    obj.sql = "SELECT b.miesiac, (SELECT sum(t.s_kwota) FROM (SELECT DATE_FORMAT(data, \"%Y-%m\") as miesiac, sum(kwota) as s_kwota FROM `wydatki` WHERE kogo = 'moje' GROUP BY DATE_FORMAT(data, \"%Y-%m\"))as t where t.miesiac <= b.miesiac) as sel FROM (SELECT DATE_FORMAT(data, \"%Y-%m\") as miesiac, sum(kwota) as s_kwota FROM `wydatki` WHERE kogo = 'moje' GROUP BY DATE_FORMAT(data, \"%Y-%m\")) as b order by 1,2";
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
  body.userId = req.user.id;
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

app.use(express.static('../frontend/'));


app.use(function(req, res, next) {
  return res.status(404).send('Route '+req.url+' Not found.');
});

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

  if (typeof obj.groupby === 'undefined' || obj.groupby.length == 0) {
    obj.groupby = '';
  }else{
    obj.groupby = obj.groupby.replace(/\sas\s[^\s,]*/,'');
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
  if (typeof param.where === 'undefined') param.where = {};
  param.where.userId = req.user.id.toString();
  console.log(param);
  const obj = param;


  if (typeof obj.orderby !== 'undefined'){
    obj.orderby = decodeOrderby(obj.orderby);
  }

  console.log("w response req.params: ", req.query);

  if (typeof obj.groupby !== 'undefined'){
    obj.groupby = decodeGroupby(obj.groupby);
  }


  if (typeof obj.where !== 'undefined'){
    obj.where = decodeWhere(obj.where);
  }

  if (typeof func !== 'undefined') func(obj);
  let sql = '';
  if (typeof obj.sql === 'undefined')  {
    sql = generujSql(obj);
  } else {
    sql = obj.sql;
    delete obj.sql;
  }
  sendSql(res,sql);
}

function sendSql(res,sql)
{
  const query = db.query(sql, (err, result) => {
    //console.log(result);
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

function decodeGroupby(obj)
{
  let groupby = obj;
  gotowy_obj = '';
  groupby.forEach((element,i) =>{
    if (element == 'rok') element = 'Year(data) as rok';
    if (element == 'miesiąc') element = 'DATE_FORMAT(data, "%Y-%m") as miesiąc';
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
