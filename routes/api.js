var express = require('express'),
  router = express.Router(),
  path = require('path'), //agar bisa akses root directory
  anomali = require('../plugins/kmeans.js'),
  db = require('../model/dataiot.js');
  

// let db = new db_model();

router.route('/').get(function (req, res, next) {
  let f = req.query.from;
  let t = req.query.to;
  console.log(f);
  console.log(t);
  let lim=99999;
  console.log(lim);
  if (req.query.limit){
    lim = parseInt(req.query.limit); 
  }
  let tmp;
  if (f && t){
    tmp = db.find({timestamp:{$gte: f, $lte:t}})
              .limit(lim)
              .sort({"timestamp": -1})
              .exec((err, data) => {
                if (err) console.log(err)
                console.log(data);
                res.json({
                    data: data
                });
              })
  }else{
    tmp = db.find({})
              .sort({"timestamp": -1})
              .limit(lim)
              .exec((err, data) => {
                if (err) console.log(err)
                console.log(data);
                res.json({
                    data: data
                });
              })
  }
  // next();
})
// router.route('/:tipe').get(function (req, res, next) {
//   let param = req.params.tipe;
//   let tmp = db.find({'tipe': param})
//               .exec((err, data) => {
//                 if (err) console.log(err)
//                 console.log(data);
//                 res.json({
//                     data: data
//                 });
//               })
//   // next();
// })

router.route('/elbow').get(function (req, res, next) {
  //harusnya get param di sini untuk get data
  let f = req.query.from;
  let t = req.query.to;
  //asumsi data udah diget dari db
  // data = []
  // for (var i = 0; i < 100; i++) {
  //   data.push({
  //     "timestamp": i-1,
  //     "ph" : i**2,
  //     "sal" : 100-i
  //   })
  // }
  //get data
  if (f && t){
    db.find({ timestamp:{
                $gte: f, 
                $lte: t //"2021-06-03T00:00:00.000Z"
              }
            })
      // .limit(lim)
      .sort({"timestamp": -1})
      .exec((err, data) => {
        if (err) console.log(err)
        // data tipenya array[x] = object
        // transformasi data jadi array[array]
        data_trans = []
        data.forEach((d, c)=>{
          data_trans.push([data[c].timestamp, data[c].ph, data[c].sal])
        })
        let cost_all = [],
            cl_result, c;
        if (data_trans.length>1){
          for (var k=2; k<10; k++) {
            cl_result = anomali.kmeans(data_trans, k);
            c = anomali.cost(cl_result);
            cost_all.push(c)
          }
        }else{
          
        }
        res.json({
          "cost": cost_all,
          "data": data
        })
      })
  }
  else
    res.json({"error": "Date Query is not Specified"})
})

router.route('/detekAnomali').get(function (req, res, next) {
  //harusnya get param di sini untuk get data
  // let k = 3; // asumsi k=3; harusnya pake params
  let f = req.query.from;
  let t = req.query.to;
  let k = req.query.k;
  if (!k){
    k = 3
  }
  //asumsi data udah diget dari db
  // data = []
  // for (var i = 0; i < 100; i++) {
  //   data.push({
  //     "timestamp": i-1,
  //     "ph" : i**2,
  //     "sal" : 100-i
  //   })
  // }
  //get data
  if (f && t){
    db.find({ timestamp:{
                $gte: f,//"2021-06-02T00:00:00.000Z", 
                $lte: t //"2021-06-03T00:00:00.000Z"
              }
            })
      // .limit(lim)
      .sort({"timestamp": -1})
      .exec((err, data) => {
        if (err) console.log(err)
        // data tipenya array[x] = object
        //transformasi data jadi array[array]
        data_trans = []
        data.forEach((d, c)=>{
          data_trans.push([data[c].timestamp, data[c].ph, data[c].sal])
        })
        // let cl_result = anomali.kmeans(data_trans, k)
        //   result = anomali.deteksiOutlier(cl_result)
        cl_result = anomali.kmeans(data_trans, k);
        ano_result = anomali.deteksiOutlier(cl_result);
        res.json({
          "centroid" : cl_result.centroid,
          "threshold": ano_result.threshold,
          "result": ano_result.data
        })
      })
  }
  else
    res.json({"error": "Date Query is not Specified"})
})

router.route('/findAndUpdate/:timestamp/:status').get(function(req, res, next) {
  let param = req.params.timestamp,
      stat = req.params.status;
  
  db.findOneAndUpdate({timestamp: param}, {status: stat}, {new: true}, (err, data) => {
    if (err) console.log(err)
    console.log(data);
    res.json({
      result: data
    })
  })
});


module.exports = router;