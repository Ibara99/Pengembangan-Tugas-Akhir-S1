const mongoose = require('mongoose');
// 	  dotenv = require('dotenv');

// const result = dotenv.config()
// if (result.error) {
//   throw result.error
// }


let db_cache = mongoose.connect("mongodb+srv://ibara1010:admin123@cluster0.4gh6a.mongodb.net/test?retryWrites=true&w=majority", { 
	useNewUrlParser: true, useUnifiedTopology: true 
})
						.then(res => console.log("Connected to DB"))
  						.catch(err => console.log(err));
let schema = new mongoose.Schema({
	timestamp : Date,
	tipe : String,
	value : Number
})
let object = mongoose.model('Iot_dummy', schema);
module.exports = object;
// class db_model {
//   constructor() {
 	 
//   }

 //  addData(tipe, value) {
	// let tmp = Date.now(); //timestamp
 //  	let obj = new object({timestamp: tmp, tipe: tipe, value: value})
	// obj.save((err, data) => {
	// 	if(err) {
	// 		console.log(err);
	// 		return {status: err};
	// 	}
	// 	console.log(data);
	// 	return {status: "ok"}
	// })
 //  }
//   findAll() {
// 	  Iot.find({})
// 	     .exec((err, data) => {
// 	    	if (err) console.log(err)
// 	      	console.log(data);
// 	  		return data
// 		 })
//   };
//   findByTipe(tipe) {
// 	  Iot.find({tipe: tipe})
// 	     .exec((err, data) => {
// 	    	if (err) console.log(err)
// 	      	console.log(data);
// 	  		return data
// 		 })
//   };
//   removeById(personId) {
// 	  Iot.findByIdAndRemove(personId, (err, data) => {
// 	    if (err) console.log(err)
// 	    return {status: "ok"}
// 	  })    
//   };
// };
// module.exports = db_model;

// let db_cache = mongoose.connect(process.env.MONGO_URI, { 
// 	useNewUrlParser: true, useUnifiedTopology: true });

// let iotSchema = new mongoose.Schema({
// 	timestamp : date,
// 	tipe : String,
// 	value : Number
// })

// const Iot = mongoose.model('Iot_dummy', iotSchema);

// let createAndSave = function(tipe, value) {
// 	let tmp = null;
//   	let obj = new Iot({timestamp: tmp, tipe: tipe, value: value})
// 	obj.save((err, data) => {
// 		if(err) console.log(err)
// 		console.log(data);
// 		return {status: "ok"}
// 	})
// };

// let findAll = function() {
//   Iot.find({})
//      .exec((err, data) => {
//     	if (err) console.log(err)
//       	console.log(data);
//   		return data
// 	 })
// };

// var removeById = function(personId) {
//   Iot.findByIdAndRemove(personId, (err, data) => {
//     if (err) console.log(err)
//     return {status: "ok"}
//   })    
// };