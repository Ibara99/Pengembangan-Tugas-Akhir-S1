var WebSocketServer = require('ws').Server;
var resources = {
	sensor : {
		suhu : {
			value : 30,
			date : "17-05-1979"
		},
		salinitas : {
			value : 50,
			date : "10-05-1974"
		},
		ph : {
			value : 7,
			date : "12-09-1999"
		}
	}
}
const clients = {};
var interval;

const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

const sendMessage = (json) => {
  // We are sending the current data to all connected clients
  Object.keys(clients).map((client) => {
    clients[client].send(json);
  });
}

exports.listen = (server) => {
	var wss = new WebSocketServer({server: server});
	console.info(`WebSocket server started . . .`);
	wss.on('connection', (ws) => {
		var userID = getUniqueID();
		clients[userID] = ws; //save connection
		ws.on('message', function incoming(message) {
			// message is json contain {namasensor: foo, value:bar, date: bar}
			// message masih dalam bentuk str, jadi perlu pake JSON.parse()
			console.log('received: %s', message);
			// SaveData(message);
			sendMessage(message);
			delete clients[userID];
		});
		// kita butuh onclose untuk delete client yg udah disimpan
		ws.on('close', function(connection) {
			console.log(userID+' is disconnected!')
			delete clients[userID];
		})
	})
}