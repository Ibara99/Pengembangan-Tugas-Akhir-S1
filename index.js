// const dotenv = require('dotenv')
// const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = 3000

//config .env
// const result = dotenv.config()
// if (result.error) {
//   throw result.error
// }

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