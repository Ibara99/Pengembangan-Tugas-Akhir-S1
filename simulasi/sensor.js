const WebSocket = require('ws');

exports.start = function(interval){
	if (interval) { localInterval = interval }
	else {localInterval = 10000}
	simulate(localInterval);
}

function simulate(localInterval) {
	interval = setInterval(function () {
	// Switch value on a regular basis
		var voltage = (50.5 + Math.random()*50).toFixed(3);
		sendAction('voltage', voltage);
	}, localInterval);
	console.info('Simulated %s actuator started!');
}

function sendAction(type,value){
	var url = 'ws://localhost:3000';
	var socket = new WebSocket(url);
	var msg = JSON.stringify({"namasensor": type, "value":value, "date": "1999/09/12"});
	
    socket.onopen = function (event) {
        if (msg) {
            socket.send(msg);
        }
    };
}