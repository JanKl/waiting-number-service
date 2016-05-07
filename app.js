var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var waitingTicket = express.Router();
var waitingTickets = [];
var nextCallNumber = 1;

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Get all waiting tickets
waitingTicket.get('/', function(req, res, next) {
  res.status(200);
  res.end(waitingTickets);
});

// Request a new ticket
waitingTicket.get('/newTicket', function(req, res, next) {
  var newTicket = {
    callNumber: nextCallNumber,
    deskNumber: 0
  };
  
  nextCallNumber += 1;
  
  waitingTicket.push(newTicket);
  
  res.status(201);
  res.end(newTicket);
});

// Request the next ticket waiting in line
waitingTicket.get('/nextTicket', function(req, res, next) {
  var nextTicket = null;
  
  var storedTicketsCount = waitingTickets.length;
  
  for (var i = 0; i < storedTicketsCount; ++i) {
    if (!waitingTicket[i].deskNumber) {
      nextTicket = waitingTicket[i];
      nextTicket.id = i;
      break;
    }
  }
  
  if (nextTicket) {
    res.status(200);
    res.end(nextTicket);
  } else {
    res.status(404);
  }
});

app.use('/waitingTicket', waitingTicket);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
