// bisa kamu pisah begini; setup http, ws, dan mqtt dipisah...
var app = require('./servers/http'),
  wsServer = require('./servers/websocket'),
  simulasiSensor = require('./simulasi/sensor'),
  simulasiSensor2 = require('./simulasi/sensor2');
// ini bagian Library-Harus-Pake
const dotenv = require('dotenv'),
  mqtt = require("mqtt");

sensorRoutes = require('./routes/sensors');

// simulasiSensor.start(1000);  //default interval 5s;
// simulasiSensor2.start(1000);  //default interval 5s;

//config .env
const result = dotenv.config()
if (result.error) {
  throw result.error
}
const port = 3000,
  USER_ID = process.env.USER_ID,
  PASS = process.env.PASS,
  ROOT = process.env.ROOT_TOPIC;

// Create a client connection
// var client = mqtt.connect("mqtt://test.mosquitto.org:1883", 
var client = mqtt.connect("mqtt://mqtt.dioty.co:1883", 
{
  username: USER_ID,
  password: PASS
}
);

client.on('connect', function() { // Check you have a connection
  console.log("mqtt connected!");
  // Subscribe to a Topic
  client.subscribe(ROOT+"#", function() {
  // When a message arrives, write it to the console
    client.on('message', function(topic, message, packet) {
      console.log("Received '" + message + "' on '" + topic + "'");
    });
  });
  // Publish a message to a Topic
  client.publish(ROOT+"TEST", 'Hello World Message!', function() {
    console.log("Message posted...");
    client.end(); // Close the connection after publish
  });
});

client.on('message', function (topic, message) { // Trigger setiap kali ada update. Dengan kata lain ini teh Subcribe nya
  console.log("Received '" + message.toString() + "' on '" + topic + "'");
  // harusnya di sini buat nyimpen ke db
});

//in case kamu males nyari lagi, ini ada template buat publish awkwk
function updateProperty (property,value) {
  client.publish(thngUrl+'/properties/'+property, '[{"value": '+value+'}]');
}

process.on('SIGINT', function() { // Trigger stiap koneksi server (akan) mati
  clearInterval(interval); //jangan nanya function ini dapet dari mana awkwk
  updateProperty ('livenow', false); //publish status...
  client.end();
  process.exit();
});

// run server
let server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
  // ws start here
  wsServer.listen(server);
})