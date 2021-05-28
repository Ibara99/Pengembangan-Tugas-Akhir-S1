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
module.exports = mongoose.model('Iot_dummy', schema);

// class db_model {
//   constructor() {
 	 
//   }

//   addData(tipe, value) {
// 	let tmp = Date.now(); //timestamp
//   	let obj = new object({timestamp: tmp, tipe: tipe, value: value})
// 	obj.save((err, data) => {
// 		if(err) {
// 			console.log(err);
// 			return {status: err};
// 		}
// 		console.log(data);
// 		return {status: "ok"}
// 	})
//   }
//   findAll() {
// 	  object.find({})
// 	     .exec((err, data) => {
// 	    	if (err) console.log(err)
// 	      console.log(data);
// 	  		return data
// 		 })
//   };
//   findByTipe(tipe) {
// 	  object.find({tipe: tipe})
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