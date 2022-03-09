#include <Wire.h>
#include "Adafruit_TCS34725.h"
/* Connect SCL    to analog 5
   Connect SDA    to analog 4
   Connect VDD    to 3.3V DC
   Connect GROUND to common ground */
byte gammatable[256];
Adafruit_TCS34725 tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_50MS, TCS34725_GAIN_4X);


int const sprayPin = 13; //purple
int const clearPin = 4; //orange
int const handednessPin = 5; //yellow
int const nextPin = 7; //green
int const backPin = 8; //blue
int const endPin = 2; //red
int const fsrPin = A0; //gray
int const pulsePin = A2; //white
int const pulseThreshold = 550;

void setup() {
  Serial.begin(9600);
  pinMode(sprayPin, INPUT);
  pinMode(clearPin, INPUT);
  pinMode(handednessPin, INPUT);
  pinMode(nextPin, INPUT);
  pinMode(backPin, INPUT);
  pinMode(endPin, INPUT);
  
  //color sensor----------------------
  if (tcs.begin()) {
  } else {
    Serial.println("No TCS34725 found ... check your connections");
    while (1); // halt!
  }
  
  while (Serial.available() <= 0) {
    Serial.println("Hello");
    delay(300);
  }
}

void loop() {

  float red, green, blue;
  tcs.getRGB(&red, &green, &blue);


  //pulse----------------------
  int pulseData = analogRead(pulsePin);
  int heartBeat;
  if (pulseData > pulseThreshold){
    heartBeat = 1;
  } else {
    heartBeat = 0;
  }

  //to p5----------------------
//  if (Serial.available() > 0) {
    int inData = Serial.read();
    int sensorValue;
    sensorValue = analogRead(fsrPin);
    Serial.print(sensorValue);
    Serial.print(',');
    Serial.print(int(red));
    Serial.print(',');
    Serial.print(int(green));
    Serial.print(',');
    Serial.print(int(blue));
    Serial.print(',');
    sensorValue = digitalRead(sprayPin);
    Serial.print(sensorValue);
    Serial.print(',');
    sensorValue = digitalRead(clearPin);
    Serial.print(sensorValue);
    Serial.print(',');
    sensorValue = digitalRead(handednessPin);
    Serial.print(sensorValue);
    Serial.print(',');
    sensorValue = digitalRead(nextPin);
    Serial.print(sensorValue);
    Serial.print(',');
    sensorValue = digitalRead(backPin);
    Serial.print(sensorValue);
    Serial.print(',');
    sensorValue = digitalRead(endPin);
    Serial.print(sensorValue);
    Serial.print(',');
    sensorValue = pulseData;
    Serial.print(sensorValue);
    Serial.print(',');
    sensorValue = heartBeat;
    Serial.println(sensorValue);
//  }

}
