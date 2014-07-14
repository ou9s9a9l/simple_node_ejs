var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');

var subform = require('./routes/subform');
var usesession = require('./routes/usesession');
var usecookies = require('./routes/usecookies');
var usecrypto = require('./routes/usecrypto'); 

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/subform', subform);
app.use('/usesession', usesession);
app.use('/usecookies', usecookies);
app.use('/usecrypto', usecrypto);
app.use('/', routes);


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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

server.listen(80);
module.exports = app;
var a=0;
var b=new Array('room1','room2','room3')
io.on('connection', function (socket) {

  //console.log("Connection " + socket.id + " accepted.");
  //console.log("rooms " + socket.rooms[0] + " .");
 socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log("socketid is:"+socket.id+" joined");
  });

  socket.on('join', function (data) {
    socket.join(data.room);
    //console.log(socket.id+" joined room :"+data.room);
    console.log(socket.rooms);
  });

  socket.on('request',function (data){
   //io.emit('updata', data);
    socket.in('room1').emit('updata', { hello: 'hello,room1' });
    socket.in('room2').emit('updata', { hello: 'hello,room2' });
    // socket.broadcast.emit('updata', { hello: 'date' });
     console.log(data);
  });
  
    
 
});

  

var net = require('net');
var dat,a;
var firstdat = false;
var tcpserver = net.createServer(function (socket) {
  // 新的连接
  //console.log(socket.id.toString());
  socket.on('data', function (data) {
   array=new Array(data.length);
   for(a=0;a<data.length;a++)
    {
      array[a]=data[a];
      array[a]=array[a].toString(16);
      if(array[a]=="0"||
        array[a]=="1"||
        array[a]=="2"||
        array[a]=="3"||
        array[a]=="4"||
        array[a]=="5"||
        array[a]=="6"||
        array[a]=="7"||
        array[a]=="8"||
        array[a]=="9"||
        array[a]=="a"||
        array[a]=="b"||
        array[a]=="c"||
        array[a]=="d"||
        array[a]=="e"||
        array[a]=="f")
        array[a]="0"+ array[a];
     // if (array[a]==",") array[a]=" ";
    }
    io.emit('updata', { hello:array });
    console.log(array.length);
    
  });
});

tcpserver.listen(23, function () {
  console.log('server bound');
});

