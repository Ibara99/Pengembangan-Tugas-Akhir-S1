var express = require('express'),
	sensorRoutes = require('./../routes/sensors'),
	cors = require('cors'),
	path = require('path');
	bodyParser = require('body-parser');

var app = express();

app.use(express.static(path.resolve('public')))

app.use(cors());
app.use('/', sensorRoutes);

// logging using middleware
app.use((req, res, next) => {
// app.use((req, res) => {
	console.log("" + req.method + " " + req.path + " " + req.ip);
	next();
})// to tell the app to parse post method
app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json());

module.exports = app;