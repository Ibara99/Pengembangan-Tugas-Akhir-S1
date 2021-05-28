var express = require('express'),
  router = express.Router(),
  path = require('path'), //agar bisa akses root directory
  db = require('../model/data.js');

// let db = new db_model();

router.route('/').get(function (req, res, next) {
  let tmp = db.find({})
              .exec((err, data) => {
                if (err) console.log(err)
                console.log(data);
                res.json({
                    data: data
                });
              })
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