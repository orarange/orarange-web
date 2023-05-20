const path = require('path');
const express = require('express')
const app = express()
const fs = require('fs');
const cookieParser = require('cookie-parser');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

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
      res.cookie('last_access', new Date().toISOString());
      return next();
    }
  }

  //ログを取る
  logRequest(req, res);
  //アクセスした時間を記録
  res.cookie('last_access', new Date().toISOString());
  next();
});

app.get('/', function (req, res) {
  res.render('index')
})

app.get('/privacy', function (req, res) {
  res.render('privacy')
})

app.get('/riot.txt', function (req, res) {
  res.sendfile('riot.txt')
})

app.get('/minecraft', function (req, res) {
  res.redirect('https://minecraft.jp/servers/server.orarange.com')
})

app.get('/minecraft/version', function (req, res) {
  res.json({ version: "0.1.1" })
})

app.listen(8080, function () { console.log('Example app listening on port 8080!') });
