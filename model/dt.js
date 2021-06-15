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
	value : String
})
module.exports = mongoose.model('Iot_rw', schema);
