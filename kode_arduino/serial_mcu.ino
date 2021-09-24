#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>
//untuk mqtt
#include <PubSubClient.h>
#include <WiFiClient.h>

//deklarasi variabel
SoftwareSerial DataSerial (12,13); //D6=12; D7=13
#define LED_BUILTIN 2 

//millis sebagai ganti delay; jaga-jaga mcu ter-reset sendiri
unsigned long prevMillis = 0;
const long interval = 10 * 1000;
int c = 6;

String arrData[2];

//konfig WiFi
const char* ssid = "Android";
const char* password = "Adminnya1?";

//konfig mqtt
const char *mqtt_broker = "test.mosquitto.org";//"broker.emqx.io";
const char *topic = "arsip.ibara@gmail.com/all"; //untuk pub
const char *subtopic = "arsip.ibara@gmail.com/#"; //untuk sub
const char *mqtt_username = "emqx"; 
const char *mqtt_password = "public";
const int mqtt_port = 1883;


WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(9600);
  DataSerial.begin(9600);
  
  //konek ke wifi
  WiFi.begin(ssid, password);
  while(WiFi.status() != WL_CONNECTED){
    delay(500);
    digitalWrite(LED_BUILTIN, LOW); //selama ga konek, led mati
  }
  //apabila konek, led baru idup
  digitalWrite(LED_BUILTIN, HIGH);

  //connecting to a mqtt broker
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);
  while (!client.connected()) {
      String client_id = "esp8266-client-";
      client_id += String(WiFi.macAddress());
      Serial.printf("The client %s connects to the public mqtt broker\n", client_id.c_str());
      if (client.connect(client_id.c_str(), mqtt_username, mqtt_password)) {
          Serial.println("Public emqx mqtt broker connected");
      } else {
          Serial.print("failed with state ");
          Serial.print(client.state());
          delay(2000);
      }
  }
  // subscribe
  client.subscribe(subtopic);
}

void loop() {
  //konfig millis
  unsigned long currMillis = millis(); //waktu sekarang
  if(currMillis - prevMillis >= interval){
    //update prevmillis
    prevMillis = currMillis;

    //cek koneksi mqtt
    if(!client.connected()){
      while (!client.connected()) {
       String client_id = "esp8266-client-";
       client_id += String(WiFi.macAddress());
       Serial.printf("The client %s connects to the public mqtt broker\n", client_id.c_str());
       if (client.connect(client_id.c_str(), mqtt_username, mqtt_password)) {
           Serial.println("Public emqx mqtt broker connected");
       } else {
           Serial.print("failed with state ");
           Serial.print(client.state());
           delay(2000);
       }
      }
    }

    //baca dari arduino (dari dataserial)
    String data = "";
    while(DataSerial.available()>0){
      data += char(DataSerial.read());
    }
    //buang spasi
    data.trim();

    //cek data
    if(data != ""){
      //format yg dikirim dari arduino ph#salinitas
      //parse data dulu
      char delimiter = '#';
      int index = 0; //untuk memasukkan data ke array
      for (int i=0; i<data.length(); i++){
        if (data[i] != delimiter)
          arrData[index] += data[i];
        else
          index++;
      }
      //cek pembacaan
      if(index == 1){
        Serial.println(arrData[0]);
        Serial.println(arrData[1]);
        Serial.println();
        if (c%6 == 0){
          String msg2 = String(arrData[0])+"-"+String(arrData[1]);
          client.publish(topic, (char*) msg2.c_str());
          c = 1;
        }else{
          c++;
        }
      }
      //reset arrData
      arrData[0] = "";
      arrData[1] = "";    
    }
    //req data ke arduino
    //Ya ini keyword yg disamakan di program arduino
    DataSerial.println("Ya");  
  }
}

void callback(char *topic, byte *payload, unsigned int length) {
 Serial.print("Message arrived in topic: ");
 Serial.println(topic);
 Serial.print("Message:");
 for (int i = 0; i < length; i++) {
     Serial.print((char) payload[i]);
 }
 Serial.println();
 Serial.println("-----------------------");
}
