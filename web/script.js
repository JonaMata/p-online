$(document).ready(function() {
			if (connection()) {
				$("#offline").hide();
				$("#online").show();
				start();
			}
});





function start() {
	$("#join").click(function() {formy("join");});
	$("#create").click(function() {formy("create");});
	$("#leave").click(function() {location.reload();})
	var chatHeight = ($(document).height() - 330);
	$("#chatBox").css({"height":chatHeight+'px'});
	function formy(action) {
		var username = $("#username").val();
		var room = $("#room").val();
		if (action == "join") {
			join(username, room);
		} else if (action == "create") {
			create(username);
		}

	}
	socket = io.connect('http://p-server.azurewebsites.net');


	function create(username) {
		$("#chatButton").show();
		$("#lobby").hide();
		$("#game").show();
		var room = "";
		$('<li />', {text : username, id : username, appendTo : $('#playerList')});
		socket.emit('create', {username: username});
		socket.on('roomShow', function(data) {
			room = data.room;
		  $("#roomSpan").text(data.room);

		});
		var players = [""];
		socket.on('player', function(data){
		  socket.emit('sendPlayers', {socket: data.socket, players: players});
		  $('<li />', {text : data.username, id : data.username, appendTo : $('#playerList')});
		//  var playerLi = $('#playerList').append($('<li>')).text(data.username).attr('id', data.username);
		  players.push(data.username);
		  });
		mainScript(username, room);
	}

	function join(username, room) {
		$("#chatButton").show();
		$("#lobby").hide();
		$("#game").show();
		$('<li />', {text : username, id : username, appendTo : $('#playerList')});
		socket.emit('join', {room: "", username: username});
		socket.on('roomShow', function(data) {
			room = data.room;
		  $("#roomSpan").text(data.room);
		});
		socket.on('playerList', function(data) {
		  data.players.forEach(function(player) {
		    $('<li />', {text : player, id : player, appendTo : $('#playerList')});
		//      var playerLi = $('#playerList').append($('<li>')).text(player).attr('id', player);
		  });
		});
		socket.on('player', function(data){
		  $('<li />', {text : data.username, id : data.username, appendTo : $('#playerList')});
			//var playerLi = $('#playerList').append($('<li>')).text(data.username).attr('id', data.username);
		  });
		mainScript(username, room);
	}
	function mainScript(username, room) {
		function sendChat() {
			var message = $('#messageBox').val();
			$('#messageBox').val("");
			socket.emit('sendMessage', {room: room, username: username, message: message});
			$('<li />', {text : username+': '+message, class : 'message', appendTo : $('#chatBox')});
			//$('#chatBox').append($('<li>').text(username+": "+message));
			return false;
		}
		window.sendChat = sendChat;
		socket.on('chatMessage', function(data) {
			$('<li />', {text : data.username+': '+data.message, class : 'message', appendTo : $('#chatBox')});
			//$('#chatBox').append($('<li>').text(data.username+": "+data.message));
		  });
		socket.on('playerDisconnect', function(data) {
			$('#'+data.username).remove();
			var playerId = players.indexOf(data.username);
			players.splice(playerId);
		  });
	}


}