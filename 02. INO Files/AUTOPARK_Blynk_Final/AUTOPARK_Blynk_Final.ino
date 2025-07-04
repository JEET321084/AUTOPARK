

/******************************************************************************
* 3‑Slot Smart‑Parking – Minimal Build (NodeMCU ESP8266)
* GPIO map: IR1 D5 (GPIO14) | IR2 D6 (GPIO12) | IR3 D7 (GPIO13)
* I2C Bus: SCL D1 (GPIO5)   | SDA D2 (GPIO4)
******************************************************************************/
#include <ESP8266WiFi.h>
#include <BlynkSimpleEsp8266.h>
#include <LiquidCrystal_I2C.h>

// 🔑  Replace with your credentials
char auth[] = "opKF1UfxhbBncZ66C5BDEJtfTSVHcB7e";
char ssid[] = "Rosogolla";
char pass[] = "rj_chatterjee";

// LCD 20×4 @ I2C ‑ default address 0x27
LiquidCrystal_I2C lcd(0x27, 20, 4);

// ── Pin map ────────────────────────────────────────────────────────────────
#define IR1 D5
#define IR2 D6
#define IR3 D7

// ── Housekeeping ────────────────────────────────────────────────────────────
uint32_t tStamp = 0;
const  uint32_t REFRESH_MS = 1000;

void setup() {
  Serial.begin(115200);

  pinMode(IR1, INPUT_PULLUP);   // LOW ≙ occupied
  pinMode(IR2, INPUT_PULLUP);
  pinMode(IR3, INPUT_PULLUP);

  lcd.init();
  lcd.backlight();
  lcd.setCursor(0,0); lcd.print(" Smart Parking ");
  delay(1000); lcd.clear();

  Blynk.begin(auth, ssid, pass);   // handles Wi‑Fi connect
}

void loop() {
  Blynk.run();

  if (millis() - tStamp >= REFRESH_MS) {
    tStamp = millis();
    updateStatus();
  }
}

// ── Core logic ─────────────────────────────────────────────────────────────
void updateStatus() {
  bool s1 = !digitalRead(IR1);   // true = occupied
  bool s2 = !digitalRead(IR2);
  bool s3 = !digitalRead(IR3);

  // Push to Blynk (1 = empty, 0 = occupied)
  Blynk.virtualWrite(V0, !s1);
  Blynk.virtualWrite(V1, !s2);
  Blynk.virtualWrite(V2, !s3);

  // LCD dashboard
  lcd.setCursor(0,0); lcd.printf("S1:%s  ", s1 ? "Occ" : "Emp");
  lcd.setCursor(0,1); lcd.printf("S2:%s  ", s2 ? "Occ" : "Emp");
  lcd.setCursor(0,2); lcd.printf("S3:%s  ", s3 ? "Occ" : "Emp");
}
