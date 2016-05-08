var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var waitingTickets = [];
var nextCallNumber = 1;

var app = express();

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Get all waiting tickets
app.get('/waitingTicket', function(req, res, next) {
  res.status(200);
  res.json(waitingTickets);
});

// Request a new ticket
app.get('/waitingTicket/newTicket', function(req, res, next) {
  var newTicket = {
    callNumber: nextCallNumber,
    deskNumber: 0
  };
  
  nextCallNumber += 1;
  
  waitingTickets.push(newTicket);
  
  // Insert the id also into the object
  var lastId = waitingTickets.length - 1;
  waitingTickets[lastId]['id'] = lastId;
  
  res.status(201);
  res.json(newTicket);
});

// Request the next ticket waiting in line
app.get('/waitingTicket/nextTicket', function(req, res, next) {
  var nextTicket = null;
  
  var storedTicketsCount = waitingTickets.length;
  
  for (var i = 0; i < storedTicketsCount; ++i) {
    if (!waitingTickets[i].deskNumber) {
      nextTicket = waitingTickets[i];
      nextTicket.id = i;
      break;
    }
  }
  
  if (nextTicket) {
    res.status(200);
    res.json(nextTicket);
  } else {
    res.status(404);
    res.end();
  }
});

// Take a ticket into process
app.put('/waitingTicket/:ticketId/takeIntoProcess', function(req, res, next) {
  if (typeof req.params.ticketId == 'undefined') {
    res.status(400);
    res.end();
    return;
  }
  
  if (typeof req.query.deskNumber == 'undefined') {
    res.status(400);
    res.end();
    return;
  }
  
  var ticketId = req.params.ticketId;
  var deskNumber = req.query.deskNumber;
  var ticketData = waitingTickets[ticketId];
  
  if (typeof ticketData == 'undefined') {
    res.status(404);
    res.end();
    return;
  }
  
  if (ticketData.deskNumber != 0) {
    res.status(409);
    res.end();
    return;
  }
  
  waitingTickets[ticketId]['deskNumber'] = deskNumber;
  res.status(200);
  res.end();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
});


module.exports = app;
