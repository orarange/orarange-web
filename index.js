const path = require('path');
const express = require('express')
const app = express()
const fs = require('fs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

index = require('./router/index');
auth = require('./router/admin');
minecraft = require('./router/minecraft');
tracker = require('./router/tracker');
privacy = require('./router/privacy');
auth = require('./router/auth');


function logRequest(req, res) {
  const logFilePath = path.join(__dirname, 'logs', 'access.log');
  //ipアドレスとuaと日時を取得
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const ua = req.headers['user-agent'];
  const time = new Date().toISOString();

  // ログのフォーマットを整える
  const logData = `${time} - [${ip}] - ${req.method} - ${req.originalUrl} - ${res.statusCode} - ${ua}\n`;

  fs.appendFile(logFilePath, logData, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

app.use((req, res, next) => {
  //10分いないにアクセスがあったらログを取らない
  if (req.cookies['last_access']) {
    const lastAccess = new Date(req.cookies['last_access']);
    const now = new Date();
    if (now.getTime() - lastAccess.getTime() < 10 * 60 * 1000) {
      return next();
    }
  }

  //ログを取る
  logRequest(req, res);
  //アクセスした時間を記録
  res.cookie('last_access', new Date().toISOString());
  next();
});

app.use('/', index);
app.use('/auth', auth);
app.use('/minecraft', minecraft);
app.use('/tracker', tracker);
app.use('/privacy', privacy);
app.use('/auth', auth);


app.listen(8080, function () { console.log('Example app listening on port 8080!') });
