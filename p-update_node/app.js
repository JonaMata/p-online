var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var execSync = require('execSync');
var exec = require('child_process');

var currentNode;
var running;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function updateNode(){
	console.log('Starting update');
	if(running) {
		currentNode.kill();
		running = false;
	}
	var execResult = execSync.run('sh /home/pi/p-updater/update.sh');
	console.log(execResult);
	var currentNode = exec.fork('/home/pi/p-server/');
	var nodeLog = currentNode.stdout;
}

app.get('/log', function(req, res){
	currentNode.stdout.pipe(res);
});

app.get('/update', function(req, res){
	updateNode();
});

app.post('/', function(req, res){
	res.send(req.body);
	updateNode();
});

var port = 443;
app.listen(port, function(){
	console.log('Listening');
});