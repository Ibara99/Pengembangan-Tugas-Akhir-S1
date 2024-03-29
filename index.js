// bisa kamu pisah begini; setup http, ws, dan mqtt dipisah...
var app = require('./servers/http'),
  //wsServer = require('./servers/websocket'),
  mqttHandler = require('./servers/mqtt_handler'),
  anomali = require('./plugins/kmeans.js'),
  path = require('path'),
  express = require('express');

// ini bagian Library-Harus-Pake
// const mqtt = require("mqtt");

//routing
sensorRoutes = require('./routes/sensors');
apiRoutes = require('./routes/api');
app.use('/', sensorRoutes);
app.use('/api', apiRoutes);

const port = 3000,
  USER_ID = process.env.USER_ID,
  PASS = process.env.PASS,
  ROOT = process.env.ROOT_TOPIC,
  // HOST = "mqtt://test.mosquitto.org:1883";
  // HOST = "mqtt://mqtt.dioty.co:1883";
  HOST = "mqtt://broker.emqx.io:1883";
//console.log(HOST);
var mqttClient = new mqttHandler(HOST, USER_ID, PASS, ROOT);
mqttClient.connect();

app.get('/logmqtt', (req, res) => {
  let val = parseInt(Math.random() *100)
  mqttClient.sendMessage(ROOT+"/bot_njs", val.toString());
  res.send('Cek in!')
})

//kita buat fungsi untuk dijalanin tiap sekian jam,
//dengan asumsi, udah tau cara post ke python
//asumsi: setInterval dilakukan setiap 10 menit sekali, 
//       dan perhitungan dilakukan setiap 8 jam sekali
var db = require('./model/dataiot.js');
function toTwoDigit(num) {
  if (num<10) return "0"+num;
  return num.toString();
}
let cronjobFunction = () =>{
  let now = new Date(),
      back = new Date(now.getTime() - 8*60*60*1000)
      GMT7 = 7;
  //pengecekan jam; jam server adalah GMT, jadi hour+7
  if (now.getUTCHours()+GMT7 == 24 || now.getUTCHours()+GMT7 == 8 || now.getUTCHours()+GMT7 == 16){
    console.log("masuk mas")
    //get fixed timestamp; pake jam GMT
    let from_, to_;
    if (now.getUTCHours()+GMT7 == 24){
      from_ = back.getUTCFullYear()+"-"+toTwoDigit(back.getUTCMonth())+"-"+toTwoDigit(back.getDate())+"T09:00:00.000Z"
      to_ = now.getUTCFullYear()+"-"+toTwoDigit(now.getUTCMonth())+"-"+toTwoDigit(now.getDate())+"T17:00:00.000Z"
    }else if (now.getUTCHours()+GMT7 == 8){
      from_ = back.getUTCFullYear()+"-"+toTwoDigit(back.getUTCMonth())+"-"+toTwoDigit(back.getDate())+"T17:00:00.000Z"
      to_ = now.getUTCFullYear()+"-"+toTwoDigit(now.getUTCMonth())+"-"+toTwoDigit(now.getDate())+"T01:00:00.000Z"
    }else if (now.getUTCHours()+GMT7 == 16){
      from_ = back.getUTCFullYear()+"-"+toTwoDigit(back.getUTCMonth())+"-"+toTwoDigit(back.getDate())+"T01:00:00.000Z"
      to_ = now.getUTCFullYear()+"-"+toTwoDigit(now.getUTCMonth())+"-"+toTwoDigit(now.getDate())+"T09:00:00.000Z"
    }
    //cek di db apakah sudah dilakukan deteksi outlier
    db.find({timestamp:{$gte: from_, $lte:to_}})
      .limit(1)
      .sort({"timestamp": -1})
      .exec((err, data) => {
        if (err) console.log(err)
        if(data.length > 2){
          // jika data terakhir belum diidentifikasi,
          if (data[0].status == "unidentified"){
            // maka lakukan deteksi (entah gimana cara ngirim post ke pyton)

            res = tes(data)
            res.result.forEach((d, i) => {
              db.findOneAndUpdate({timestamp: d.timestamp}, {status: d.status}, {new: true}, (err, data) => {
                if (err) console.log(err)
                // console.log(data);
              })
            })
          }
        //jika sudah (entah normal ato outlier), abaikan cronjob
        }
      })
  }else
    console.log("Tunggu jam 8")
}

let tes = function(data){
  //harusnya get param di sini untuk get data
  let k = 3; // asumsi k=3; harusnya pake params
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
  return {
    "centroid" : cl_result.centroid,
    "threshold": ano_result.threshold,
    "result": ano_result.data
  }
}
setInterval(cronjobFunction, 10*60*1000)

//ini untuk anu wkwk
var sampleData = function(){
  console.log("anu");
  let now = new Date(),
    back = new Date(now.getTime() - 1*60*1000);

  from_ = back.getUTCFullYear()+"-06-"+toTwoDigit(back.getDate())+"T"+toTwoDigit(back.getUTCHours())+":"+toTwoDigit(back.getUTCMinutes())+":00.000Z";
  to_ = now.getUTCFullYear()+"-06-"+toTwoDigit(now.getDate())+"T"+toTwoDigit(now.getUTCHours())+":"+toTwoDigit(now.getUTCMinutes())+":00.000Z";
  db.find({timestamp:{$gte: from_, $lte:to_}})
      .limit(1)
      .sort({"timestamp": -1})
      .exec((err, data) => {
        if (err) console.log(err)

        if(data.length > 0){
          console.log("gs");
          //jika ada kita get oh dan sal
          var p = data[0].ph,
          s = data[0].sal;
          if(now.getUTCHours() == 0){
            s = s + 50;
          }
          else if (now.getUTCHours() == 8){
            p = p - 2;
          }
          else if(now.getUTCHours() == 16){
            s = s + 50;
            p = p - 2;
          }
          let val = ""+p+"-"+s;
          mqttClient.sendMessage(ROOT+"/all", val);
          
        }
      })
}
setInterval(sampleData, 1*60*1000)


//error handling
app.use(function (req, res, next) {
  // res.status(404).send("Sorry can't find that!")
  res.sendFile(path.resolve("views/404.html"))
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  // res.status(500).send('Something broke!')
  res.sendFile(path.resolve("views/500.html"))
})

// run server
let server = app.listen(port, () => {
  console.log(`Example app listening at port:${port}`)
  // ws start here
  // wsServer.listen(server);
  
  mqttClient.sendMessage(ROOT, "34");
})