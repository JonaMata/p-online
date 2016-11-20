function initIPAdress() {
    var adr = process.env.OPENSHIFT_NODEJS_IP;
    if (typeof adr === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using localhost');
            adr = 'localhost';
    }

    return adr;
}

var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var io = require('socket.io');
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





io.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://p-online.juanto3.me');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

io.listen(port, initIPAdress());
