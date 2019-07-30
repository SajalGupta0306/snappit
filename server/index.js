"use strict"
var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var path = require('path')
var logger = require('morgan')
var helmet = require('helmet')

var routes = require('./routes/index')
var docs = require('./routes/docs');
var api = require('./routes/api');
var app = express()
const authMiddleware = require('./middlewares/auth');
var db = mongoose.connection

var config = require('./config');
var PORT = config.port

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'../client/views'))
app.use(express.static(path.join(__dirname,'../client/public/')))
app.use(logger('dev'))
app.use(helmet())

mongoose.set('useCreateIndex', true);
mongoose.connect(config.dbHost,{ useNewUrlParser: true });
db.on('error', console.error.bind(console, 'connection error : '))
db.once('open', function(callback) {
    console.log('Connected to : ' + config.dbHost)
})

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/', function(req, res) {
    res.render('index')
});

//middleware to parse jwt
app.use('/api', authMiddleware.authHeader);
app.use('/api', api);

app.use('/docs', docs);
app.use('/', routes);

app.listen(PORT, function(err) {
    console.log('Listening to port : ' + PORT)
})
