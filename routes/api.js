var express = require('express'),
  router = express.Router(),
  path = require('path'), //agar bisa akses root directory
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
router.route('/:tipe').get(function (req, res, next) {
  let param = req.params.tipe;
  let tmp = db.find({'tipe': param})
              .exec((err, data) => {
                if (err) console.log(err)
                console.log(data);
                res.json({
                    data: data
                });
              })
  // next();
})

module.exports = router;