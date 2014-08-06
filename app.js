var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var subform = require('./routes/subform');
var usecookies = require('./routes/usecookies');


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
app.use(function(req,res,next){
    console.log("%s %s",req.method,req.url);
    next();
});
app.use('/', routes);
app.use('/subform', subform);
app.use('/usecookies', usecookies);


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
//module.exports = app;
var a=0;
var socketflag;

io.on('connection', function (socket) {
    
  console.log("socketid is:"+socket.id+" joined");
  socket.emit('news', { hello: 'world' });
 

  socket.on('join', function (data) {
    socketflag=0;
    for(a=0;a<socket.rooms.length;a++)
      if(socket.rooms[a]==data.room)socketflag=1;

   if(socketflag)
     socket.leave(data.room,function(){
       socket.emit('roomsin',{room:socket.rooms});
       console.log(socket.id+" leaved "+data.room);
    });
   else
    socket.join(data.room,function (err){
       console.log(socket.id+" joined "+socket.rooms[socket.rooms.length-1]);
       socket.emit('roomsin',{room:socket.rooms});
    });
  
   
  });

  socket.on('disconnect', function(){
    console.log("socketid is:"+socket.id+" disconnect");
  });

  socket.on('request',function (data){
   //socket.in('平南').emit('updata', { hello: 'hello,平南' });  当前socket接收不到
    io.in('平南').emit('updata', { dat: 'hello,平南' });
    io.in('保定南').emit('updata', { dat: 'hello,保定南' });
  
     console.log(data);
  });
  
    
 
});



var net = require('net');
var dat,a;
var firstdat = false;
var tcpserver = net.createServer(function (socket) {
  // 新的连接



  console.log('CONNECTED: ' +
        socket.remoteAddress + ':' + socket.remotePort);
  //console.log(socket.id.toString());
  socket.on('data', function (data) {

    socket.write("1");


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
    io.in('平南').emit('updata', { dat:array });
    console.log(array.length);
  
    
  });
});
  
tcpserver.listen(23, function () {
  console.log('server bound');
});

