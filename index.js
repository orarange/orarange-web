const path = require('path');
const express = require('express')
const app = express()
const fs = require('fs');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

function logRequest(req, res) {
    const logFilePath = path.join(__dirname, 'log', 'access.log');
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
    // ログを書き込む
    logRequest(req, res);
  
    next();
  });
  
app.get('/',function(req,res){
    res.render('index')
})

app.get('/privacy',function(req,res){
    res.render('privacy')
})

app.get('/minecraft/version',function(req,res){
    res.json({version: "0.1.1"})
})

app.listen(8080, function () {console.log('Example app listening on port 8080!')});
