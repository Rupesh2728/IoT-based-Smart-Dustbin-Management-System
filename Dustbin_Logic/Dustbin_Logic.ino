// #include <FirebaseESP8266.h>
#include <Arduino.h>
#include  <ESP8266WiFi.h>
#include <Firebase_ESP_Client.h>

#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

#include<SoftwareSerial.h>
SoftwareSerial myserial (D0,D2);

const int trigPin = 12;
const int echoPin = 14;

//define sound velocity in cm/uS
#define SOUND_VELOCITY 0.034
#define CM_TO_INCH 0.393701

#define FIREBASE_HOST "iot-dustbin-management-system-default-rtdb.firebaseio.com"
#define WIFI_SSID "Rupesh" 
#define WIFI_PASSWORD "peddineni28"
#define FIREBASE_Authorization_key "AIzaSyA9zuqprNh0wcVTvhiGlObXwSZBO_l9KWk"

long duration;
float distanceCm;
float distanceInch;

FirebaseData fbdo;
FirebaseJson json;
FirebaseConfig config;
FirebaseAuth auth;
bool signupOK = false;
unsigned long sendDataPrevMillis = 0;

// Array to store 10 values
const int numReadings = 10;
float readings[numReadings]; 
int readIndex = 0;           
float total = 0;              
float average = 0;  
int readingsCount = 0;  
float height_dustbin = 30;     
float fill_C = 0;   

void setup() {

 Serial.begin(115200);
 pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
 pinMode(echoPin, INPUT); // Sets the echoPin as an Input

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  /* Assign the api key (required) */
  config.api_key = FIREBASE_Authorization_key;

  /* Assign the RTDB URL (required) */
  config.database_url =  FIREBASE_HOST;

  /* Sign up */
  if (Firebase.signUp(&config, &auth, "", "")){
    Serial.println("ok");
    signupOK = true;
  }
  else{
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h
  
  Firebase.begin(&config,&auth);
  Firebase.reconnectWiFi(true);

  // Initialize all readings to 0
  for (int i = 0; i < numReadings; i++) {
    readings[i] = 0;
  }
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  duration = pulseIn(echoPin, HIGH);
  
  distanceCm = duration * SOUND_VELOCITY/2;

  total = total - readings[readIndex];

  Serial.println(readIndex);

  readings[readIndex] = distanceCm;
  total = total + readings[readIndex];


  readIndex = (readIndex + 1) % numReadings;

  readingsCount++;

  if (readingsCount >= numReadings) {

    average = total / numReadings;
    fill_C = 100-((average/height_dustbin)*100);

    if (Firebase.ready() && signupOK) {
      if (Firebase.RTDB.setFloat(&fbdo, "sensor_data/fill_C", fill_C)) {
        Serial.println("PASSED");
        Serial.println("PATH: " + fbdo.dataPath());
        Serial.println("TYPE: " + fbdo.dataType());
        Serial.print("Fill Percentage: ");
        Serial.println(fill_C);
        Serial.println(average);

      } else {
        Serial.println("FAILED");
        Serial.println("REASON: " + fbdo.errorReason());
      }
    }

    // Reset the readings count to start new cycle
    readingsCount = 0;
  }

  delay(300); // Delay 1 second before next measurement
}