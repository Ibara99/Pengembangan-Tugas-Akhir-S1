// bisa kamu pisah begini; setup http, ws, dan mqtt dipisah...
var app = require('./servers/http'),
  wsServer = require('./servers/websocket'),
  simulasiSensor = require('./simulasi/sensor'),
  simulasiSensor2 = require('./simulasi/sensor2'),
  mqttHandler = require('./servers/mqtt_handler'),
  express = require('express');

// ini bagian Library-Harus-Pake
// const dotenv = require('dotenv'),
const mqtt = require("mqtt");

sensorRoutes = require('./routes/sensors');
apiRoutes = require('./routes/api');
app.use('/', sensorRoutes);
app.use('/api', apiRoutes);

// simulasiSensor.start(1000);  //default interval 5s;
// simulasiSensor2.start(1000);  //default interval 5s;

//config .env
// const result = dotenv.config()
// if (result.error) {
//   throw result.error
// }
const port = 3000,
  USER_ID = process.env.USER_ID,
  PASS = process.env.PASS,
  ROOT = process.env.ROOT_TOPIC,
  HOST = "mqtt://test.mosquitto.org:1883";
  // HOST = "mqtt://"+process.env.BROKER_HOST +":1883";
console.log(HOST);
var mqttClient = new mqttHandler(HOST, USER_ID, PASS, ROOT);
mqttClient.connect();
app.get('/logmqtt', (req, res) => {
  let val = parseInt(Math.random() *100)
  mqttClient.sendMessage(ROOT+"/bot_njs", val.toString());
  res.send('Cek in!')
})
app.get('/sendData/:tipe/:value', (req, res) => {
  // req.params: { "userId": "34", "bookId": "8989" }
  mqttClient.sendMessage(ROOT+"/"+req.params.tipe, req.params.value);
  res.json(req.params);
})
app.get('/send-data/:ph/:sal', (req, res) => {
  // req.params: { "userId": "34", "bookId": "8989" }
  mqttClient.sendMessage(ROOT+"/ph", req.params.ph);
  mqttClient.sendMessage(ROOT+"/salinitas", req.params.sal);
  res.json(req.params);
})

// run server
let server = app.listen(port, () => {
  console.log(`Example app listening at http://.localhost:${port}`)
  // ws start here
  wsServer.listen(server);
  
  mqttClient.sendMessage(ROOT, "34");
})