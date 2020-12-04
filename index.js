// bisa kamu pisah begini; setup http, ws, dan mqtt dipisah...
var app = require('./servers/http');
//   wsServer = require('./servers/websockets'),
//   resources = require('./resources/model');

// sensorRoutes = require('./routes/sensors')


// ini bagian Library-Harus-Pake
// const dotenv = require('dotenv') //ini buat anu
const port = 3000

// ini bagian mqtt
// var mqtt = require('mqtt');

//config .env
// const result = dotenv.config()
// if (result.error) {
//   throw result.error
// }

// ini config klo pake EVRYTHNG
// var thngId=config.thngId; //sepertinya ini username
// var thngUrl='/thngs/'+thngId; //ini url-topik dasar untuk pub-sub; hanya berlaku untuk evrythng
// var thngApiKey=config.thngApiKey; // ini password
// var interval;

// console.log('Using Thng #'+thngId+' with API Key: '+ thngApiKey);

// //koneksi mqtt
// var client = mqtt.connect("mqtts://mqtt.evrythng.com:8883", {
//   username: 'authorization',
//   password: thngApiKey 
// });

// client.on('connect', () => {  //callback ketika koneksi mqtt berhasil
//   client.subscribe(thngUrl+'/properties/'); // ini subcribe ke topik apa aja..
//   updateProperty('livenow', true); // Untuk set property 'livenow', alias ini teh publish

//   if (!interval) interval = setInterval(updateProperties, 5000); // Trigger simulasi read sensor
// });

// client.on('message', function (topic, message) { // Trigger setiap kali ada update. Dengan kata lain ini teh Subcribe nya
//   console.log(message.toString());
//   // harusnya di sini buat nyimpen ke db
// });

// //in case kamu males nyari lagi, ini ada template buat publish awkwk
// function updateProperty (property,value) {
//   client.publish(thngUrl+'/properties/'+property, '[{"value": '+value+'}]');
// }

// process.on('SIGINT', function() { // Trigger stiap koneksi server (akan) mati
//   clearInterval(interval); //jangan nanya function ini dapet dari mana awkwk
//   updateProperty ('livenow', false); //publish status...
//   client.end();
//   process.exit();
// });

// run server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
  // ws start here
})