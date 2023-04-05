
const path = require('path');
const express = require('express')
const app = express()

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res){
    res.render('index')
})

app.get('/minecraft/version',function(req,res){
    res.json({version: "0.1.1"})
})

app.listen(8080, function () {console.log('Example app listening on port 8080!')});
