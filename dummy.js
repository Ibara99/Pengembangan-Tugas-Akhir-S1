const express = require('express')
const app = express()
const port = 5555 
const wsServer = require('./servers/websocket');
app.use(express.static('public'))
app.get('/', (req, res) => {
	let sal = (Math.random() * 100).toFixed();
	// if (sal > 50) sal = 50;
	let asam = (Math.random() * 10).toFixed();
  	res.json({
  		salinitas : sal,
  		ph : asam
  	})
})
app.get('/anu', (req, res) => {
	res.sendFile(__dirname + "/views/wsClient.html");
})
app.get('/ubah', (req, res) => {
	res.sendFile(__dirname + "/views/pengubah.html");
})

// run server
let server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)

  wsServer.listen(server);
})