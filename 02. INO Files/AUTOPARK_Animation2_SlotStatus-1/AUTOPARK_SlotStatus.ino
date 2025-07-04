// For ESP1 Top One (connected to OLED and (Proximity via Underside))
#includeDoubleblinkinclude <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "Start_Animation2_29Apr25.h"  // Include the animation header

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET    -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

#define SENSOR_1 D0
#define SENSOR_2 D1
#define SENSOR_3 D2
#define SENSOR_4 D3

#define SDA_PIN  D5  
#define SCL_PIN  D6

#define RED_LED  D8 // Used for double-blink effect

unsigned long lastStatusUpdateTime = 0;
unsigned long statusDuration = 9000;
unsigned long animationDuration = 3000;
bool animationRunning = false;
unsigned long lastAnimationTime = 0;

// Double Blink LED variables without fade
enum BlinkState { BLINK_ON1, BLINK_OFF1, BLINK_ON2, BLINK_OFF2, BLINK_PAUSE };
BlinkState blinkState = BLINK_ON1;
unsigned long lastBlinkTime = 0;
unsigned long blinkInterval = 150; // ms for short ON and OFF (fast blink)
unsigned long pauseInterval = 4000; // pause between blink cycles

// Variables for Animation Frame Tracking
unsigned int currentFrame = 0;
unsigned long lastAnimationUpdateTime = 0;
unsigned long animationFrameDuration = 30;  // Reduced for smoother animation (was 50)

void runStartupAnimation() {
    unsigned long currentMillis = millis();
    if (currentMillis - lastAnimationUpdateTime >= animationFrameDuration) {
        // Display the next frame of the animation
        if (currentFrame <= 204) {
            if (currentFrame >= 103 && currentFrame <= 118) {
                currentFrame++;
                return;  // Skip frames
            }
            display.clearDisplay();
            display.setTextColor(SSD1306_WHITE);
            display.drawBitmap(0, 0, epd_bitmap_allArray[currentFrame], 128, 64, WHITE);
            display.display();  // Non-blocking display update
            currentFrame++; // Move to next frame
        } else {
            // Reset and stop animation
            currentFrame = 0;
            animationRunning = false;
            lastStatusUpdateTime = millis();  // Reset status time to show status again
        }
        lastAnimationUpdateTime = currentMillis;
    }
}

void showStatus() {
    int slot1 = digitalRead(SENSOR_1);
    int slot2 = digitalRead(SENSOR_2);
    int slot3 = digitalRead(SENSOR_3);
    int slot4 = digitalRead(SENSOR_4);
    
    display.clearDisplay();
    display.setTextSize(2);
    display.setTextColor(SSD1306_WHITE);
    
    display.setCursor(5, 14);  
    display.print("P1");
    display.fillRect(35, 10, 20, 20, slot1 ? SSD1306_BLACK : SSD1306_WHITE);
    display.drawRect(35, 10, 20, 20, SSD1306_WHITE);
    
    display.setCursor(70, 14);  
    display.print("P2");
    display.fillRect(100, 10, 20, 20, slot2 ? SSD1306_BLACK : SSD1306_WHITE);
    display.drawRect(100, 10, 20, 20, SSD1306_WHITE);
    
    display.setCursor(5, 44);  
    display.print("P3");
    display.fillRect(35, 40, 20, 20, slot3 ? SSD1306_BLACK : SSD1306_WHITE);
    display.drawRect(35, 40, 20, 20, SSD1306_WHITE);
    
    display.setCursor(70, 44);  
    display.print("P4");
    display.fillRect(100, 40, 20, 20, slot4 ? SSD1306_BLACK : SSD1306_WHITE);
    display.drawRect(100, 40, 20, 20, SSD1306_WHITE);
    
    display.display();
}

void setup() {
    pinMode(SENSOR_1, INPUT);
    pinMode(SENSOR_2, INPUT);
    pinMode(SENSOR_3, INPUT);
    pinMode(SENSOR_4, INPUT);
    pinMode(RED_LED, OUTPUT);
    digitalWrite(RED_LED, LOW);

    Wire.begin(SDA_PIN, SCL_PIN);

    if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
        for (;;); // halt if display fails
    }

    display.clearDisplay();
    lastStatusUpdateTime = millis();
}

void loop() {
    unsigned long currentMillis = millis();

    // Handle status and animation
    if (!animationRunning && (currentMillis - lastStatusUpdateTime >= statusDuration)) {
        animationRunning = true;
        lastAnimationTime = currentMillis;
    }

    if (animationRunning) {
        runStartupAnimation();
    } else {
        showStatus();
    }

    // Handle RED LED double-blink effect without fading
    handleBlinking();
}

// Simplified LED double-blink without fades
void handleBlinking() {
    unsigned long currentMillis = millis();

    switch (blinkState) {
        case BLINK_ON1:
            digitalWrite(RED_LED, HIGH);
            if (currentMillis - lastBlinkTime >= blinkInterval) {
                blinkState = BLINK_OFF1;
                lastBlinkTime = currentMillis;
            }
            break;

        case BLINK_OFF1:
            digitalWrite(RED_LED, LOW);
            if (currentMillis - lastBlinkTime >= blinkInterval) {
                blinkState = BLINK_ON2;
                lastBlinkTime = currentMillis;
            }
            break;

        case BLINK_ON2:
            digitalWrite(RED_LED, HIGH);
            if (currentMillis - lastBlinkTime >= blinkInterval) {
                blinkState = BLINK_OFF2;
                lastBlinkTime = currentMillis;
            }
            break;

        case BLINK_OFF2:
            digitalWrite(RED_LED, LOW);
            if (currentMillis - lastBlinkTime >= blinkInterval) {
                blinkState = BLINK_PAUSE;
                lastBlinkTime = currentMillis;
            }
            break;

        case BLINK_PAUSE:
            digitalWrite(RED_LED, LOW);
            if (currentMillis - lastBlinkTime >= pauseInterval) {
                blinkState = BLINK_ON1;
                lastBlinkTime = currentMillis;
            }
            break;
    }
}

//final Doubleblink No fade 4 May 25 
