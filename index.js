// ini bagian Library-Harus-Pake
// const dotenv = require('dotenv') //ini buat anu
// const bodyParser = require('body-parser') //saya lupa ini buat apa awkwk
const express = require('express')
const app = express()
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

//middlewares
// mount  assets
app.use(express.static(__dirname + "/public"))

// logging using middleware
// app.use((req, res, next) => {
// app.use((req, res) => {
	// console.log("" + req.method + " " + req.path + " " + req.ip);
	// next();
// })// to tell the app to parse post method
// app.use(bodyParser.urlencoded({extended: false}))

// routing
app.get('/', (req, res) => {
  	res.send('Hello World!')
})
app.get('/dummy', (req, res) => {
	let sal = (Math.random() * 100).toFixed();
	// if (sal > 50) sal = 50;
	let asam = (Math.random() * 10).toFixed();
  	res.json({
  		salinitas : sal,
  		ph : asam
  	})
})
app.get('/tes', (req, res) => {
	res.sendFile(__dirname + "/views/plug.html")
})
app.get('/temp', (req, res) => {
	res.sendFile(__dirname + "/views/template.html")
})
app.get('/json', (req, res) => {
	res.json({
		"message": "hello world!"
	})
})

// run server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})