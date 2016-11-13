var io = require('socket.io').listen(80);

io.on('connection', function(socket) {
  console.log('connected');
});
