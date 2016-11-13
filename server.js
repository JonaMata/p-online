var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
var app = require('express')();
var http = require('http').Server(app);

app.get('/', function(req, res) {
    res.send('<h1>Hello world</h1>');
});
//We need a function which handles requests and send response
function handleRequest(request, response){
    response.end('It Works!! Path Hit: ' + request.url);
}

http.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", port " + server_port )
});

var io = require('socket.io').listen(server);

io.on('connection', function(socket) {
  console.log('connected');
});
