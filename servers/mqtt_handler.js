const mqtt = require('mqtt'),
      db = require('../model/data.js');

// let db = new db_model();

class MqttHandler {
  constructor(host, username, password, root) {
    this.mqttClient = null;
    this.host = host;
    this.username = username; // mqtt credentials if these are needed to connect
    this.password = password;
    this.root = root;
    // this.db = new db_model();
  }
  
  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host, { username: this.username, password: this.password });

    // Mqtt error calback
    this.mqttClient.on('error', (err) => {
      console.log(err);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on('connect', () => {
      console.log(`mqtt client connected`);
   });

    // mqtt subscriptions
    this.mqttClient.subscribe(this.root+"/#", {qos: 0});

    // When a message arrives, console.log it
    this.mqttClient.on('message', function (topic, message) {
      console.log("received: "+message.toString());
      let tmp = topic.split('/');
      let value = parseInt(message);
      console.log(tmp);

      //add to dv
      let tgl = Date.now(); //timestamp
      let obj = new db({timestamp: tgl, tipe: tmp[tmp.length - 1], value: value})
      obj.save((err, data) => {
        if(err) {
          console.log(err);
          return {status: err};
        }
        console.log(data);
        return {status: "ok"}
      })
    });

    this.mqttClient.on('close', () => {
      console.log(`mqtt client disconnected`);
    });
  }

  // Sends a mqtt message to topic: mytopic
  sendMessage(topic, message) {
    this.mqttClient.publish(topic, message);
  }
}
module.exports = MqttHandler;