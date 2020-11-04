const express = require('express')
const app = express()
const port = 5555 

app.get('/', (req, res) => {
	let sal = (Math.random() * 100).toFixed();
	// if (sal > 50) sal = 50;
	let asam = (Math.random() * 10).toFixed();
  	res.json({
  		salinitas : sal,
  		ph : asam
  	})
})

// run server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})