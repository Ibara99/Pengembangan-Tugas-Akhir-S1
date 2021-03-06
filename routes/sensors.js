var express = require('express'),
  router = express.Router(),
  path = require('path'); //agar bisa akses root directory

router.route('/').get(function (req, res, next) {
  res.send('Hello World!');
  next();
})
router.route('/coba').get(function (req, res, next) {
  res.sendFile(path.resolve("views/json_view.html"))
})

// ini untuk gui
router.route('/dashboard').get(function (req, res, next) {
  res.sendFile(path.resolve("views/linechart.html"))
})
router.route('/data').get(function (req, res, next) {
  res.sendFile(path.resolve("views/dataview.html"))
})
router.route('/data-ph').get(function (req, res, next) {
  res.sendFile(path.resolve("views/dataview.html"))
})
router.route('/data-salinitas').get(function (req, res, next) {
  res.sendFile(path.resolve("views/linechart.html"))
})
router.route('/deteksi-anomali').get(function (req, res, next) {
  res.sendFile(path.resolve("views/linechart.html"))
})
router.route('/backpro').get(function (req, res, next) {
  res.sendFile(path.resolve("views/linechart.html"))
})
router.route('/sma').get(function (req, res, next) {
  res.sendFile(path.resolve("views/linechart.html"))
})
// sampe sini

router.route('/dummy').get(function (req, res, next) { 
  let sal = (Math.random() * 100).toFixed();
  // if (sal > 50) sal = 50;
  let asam = (Math.random() * 10).toFixed();
    res.json({
      salinitas : sal,
      ph : asam
    })
})
router.route('/tes').get(function (req, res, next) {
  res.sendFile(path.resolve("views/plug.html"))
})
router.route('/temp').get(function (req, res, next) {
  res.sendFile(path.resolve("views/template.html"))
})
router.route('/json').get(function (req, res, next) {
  res.json({
    "message": "hello world!"
  })
})

module.exports = router;