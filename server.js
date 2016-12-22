var app = require('express')();
var http = require('http').Server(app);
var port = process.env.PORT || 8080;

app.get('/', function(req, res){
  res.sendfile( __dirname + '/web/' + 'index.html');
});

app.use('/static', express.static(path.join(__dirname, 'web')))

http.listen(port, function(){
  console.log('listening on *: ' + port);
});


var io = require('socket.io')(http);

console.log('port: ' + port);
io.on('connection', function(socket) {
  var room = "";
  var username = "";
  console.log('connected');
  socket.on('create', function(data) {
    var username = data.username;
    function makeid() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      for( var i=0; i < 6; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }
    var room = makeid();
    socket.join(room);
    socket.emit('roomShow', {room: room});
    console.log(username + ' created ' + room);
  });
  socket.on('join', function(data) {
    console.log('join');
    var room = data.room.toUpperCase();
    var username = data.username;
    socket.join(room);

    console.log(username + ' joined ' + room);
    socket.emit('roomShow', {room: room});
    io.to(room).emit('player', {username: username, socket: socket.id});
    console.log('player');
  });
  socket.on('sendPlayers', function(data) {
    socket.broadcast.to(data.socket).emit('playerList', {players: data.players});
  });
  socket.on('sendMessage', function(data) {
    socket.broadcast.to(data.room).emit('chatMessage', {message: data.message, username: data.username});
  });
  socket.on('startGame', function(data) {
    //var winner = io.sockets.adapter
  });
  socket.on('disconnect', function() {
    io.to(room).emit('playerDisconnect', {username: username, rip: true});
  });
});
