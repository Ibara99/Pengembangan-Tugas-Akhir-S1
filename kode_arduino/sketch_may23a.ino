//http://arduino.esp8266.com/stable/package_esp8266com_index.json
//990-9.18
//1024-4.0i
//542-6.86

#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <WiFiClient.h>

// WiFi
const char *ssid = "ahah"; // Enter your WiFi name
const char *password = "07770668";  // Enter WiFi password

// MQTT Broker
//pake emqx bisa bjir
const char *mqtt_broker = "test.mosquitto.org";//"broker.emqx.io";
//nanti bedakan topik publish sama sub
const char *topic = "arsip.ibara@gmail.com/all";
const char *subtopic = "arsip.ibara@gmail.com/#";
const char *mqtt_username = "emqx";
const char *mqtt_password = "public";
const int mqtt_port = 1883;

// define pins
// define pin multiplexer
#define MUX_A D4
#define MUX_B D3
#define MUX_C D2

/* asumsi multiplexer
 *  x0 : ph
 *  xl : tds
 */

// define analog pin
#define ANALOG_INPUT A0

//define variabel(s)
float rawInput, tegangan_ph, tegangan_tds, phval;
float VOLTASE_3V = 3.3, VOLTASE_5V = 5;
int max_bit = 1023;
int c=0;

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
 // Set software serial baud to 115200;
 Serial.begin(115200);
 // connecting to a WiFi network
 WiFi.begin(ssid, password);
 while (WiFi.status() != WL_CONNECTED) {
     delay(500);
     Serial.println("Connecting to WiFi..");
 }
 Serial.println("Connected to the WiFi network");
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
 // publish and subscribe
 client.subscribe(subtopic);
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

 //Deifne output pins for Mux
  pinMode(MUX_A, OUTPUT);
  pinMode(MUX_B, OUTPUT);     
  pinMode(MUX_C, OUTPUT);
}

float toPH(float x){
  //y=-0.1524*X + 160.0 
  //0.005179*X + 4.053
  return 0.005179*x + 4.053;
}
void changeMux(int c, int b, int a) {
  digitalWrite(MUX_A, a);
  digitalWrite(MUX_B, b);
  digitalWrite(MUX_C, c);
}
int bit2tegangan(float bitrate, float VOLTASE){
  return bitrate * (VOLTASE /  max_bit);
}

void loop() {
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
  //ph
  changeMux(LOW, LOW, LOW); //punya ph X1
  rawInput = analogRead(ANALOG_INPUT); //Value of the sensor connected Option 0 pin of Mux
//  rawInput = readd(); //Value of the sensor connected Option 0 pin of Mux
  tegangan_ph = rawInput; //bit2tegangan(rawInput, VOLTASE_3V);
  phval = toPH(tegangan_ph);
  Serial.println("ph");
  Serial.println(tegangan_ph);
  Serial.println(phval);
  delay(10);

  changeMux(LOW, LOW, HIGH); //punya tds X2
  rawInput = analogRead(ANALOG_INPUT); //Value of the sensor connected Option 1 pin of Mux
  tegangan_tds = rawInput; //bit2tegangan(rawInput, VOLTASE_3V);
  Serial.println("tds");
  Serial.println(tegangan_tds);

  String msg = String(tegangan_ph)+"-"+String(tegangan_tds);
  String msg2 = String(phval)+"-"+String(tegangan_tds);
  
 if (c==6){
 client.publish("arsip.ibara@gmail.com/raw", (char*) msg.c_str());
 client.publish(topic, (char*) msg2.c_str());
 c = 0;
 }else{
  c++;
 }
 client.loop();
 delay(10*1000);
 
}
