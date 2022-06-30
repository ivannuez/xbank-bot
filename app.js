var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');

//Conexion a la BD
mongoose.connect('mongodb+srv://xbank:xbank@cluster0.yojhsvx.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true
}, (err) => {
  if (!err) {
    console.log('MongoDB Connection Succeeded.')
  } else {
    console.log('Error in DB connection : ' + err)
  }
});

var app = express();


// debug setup
app.use(logger('dev'));


// body request setup
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));


//server static setup
app.use(express.static(path.join(__dirname, 'public')));


//Rutas
var indexRouter = require('./routes/index');
var webhookController = require('./controllers/webhookController');

app.use('/', indexRouter);
app.use('/api/wa/webhook', webhookController);

module.exports = app;