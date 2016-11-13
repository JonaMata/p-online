var io = require('socket.io').listen(8080);

io.on('connection', function(socket) {
  console.log('connected');
});
