🚗 AUTOPARK: IoT-Based Next Generation Parking Management System
===================================================================

🔧 Overview
----------------
**AUTOPARK** is a real-time IoT-based smart parking management system designed to automate and streamline the vehicle parking process using ESP8266 microcontrollers, IR sensors, web technologies, and secure APIs. The project minimizes human intervention, enhances parking slot visibility, and provides a seamless entry-exit and payment workflow through web integration and QR-based authentication.

📌 Key Features
-------------------
- 🔁 Real-time Parking Slot Detection  
- 🔐 Secure User Registration with Email Verification  
- 📊 Live Slot Availability Dashboard (User UI)  
- 🧾 Unique QR Code Generation Based on Vehicle Number  
- 📲 Web-Based Entry/Exit Logging via QR Scanning (Admin UI)  
- 🚪 Automated Gate Control Based on QR Scan Logs  
- 💳 EasyPay Integration with Razorpay (UPI Payments)  
- 🖥️ Fully Functional Web Interfaces for Both Users and Admins  
- 🌐 Cloud Connectivity Using Blynk API  

📂 Project Structure
---------------------
AUTOPARK/
├── 01.Documentation/                # Autopark complete report and ppt
├── 02.INO Files/
│   ├── AUTOPARK_SlotStatus.ino       # ESP8266 controlling OLED display + IR sensors
│   ├── AUTOPARK_Start_Animation2.h   # Autopark Animation
│   └── AUTOPARK_Blynk_Final.ino      # ESP8266 handling gate access + Blynk APIs
├── 03.Models/                        # Model Images
├── 06.Websites/
│   ├── AutoparkBase/                 # Frontend UI for users (HTML/CSS/JS)
│   ├── AdminAutopark/                # Fullstack UI for admins with QR scanner (HTML/CSS/JS/Database)
├── 03.Photos/                        # Screenshots
└── README.md                         # Project documentation

💻 System Architecture
--------------------------
**Hardware Components:**
- 2x ESP8266 NodeMCU  
- IR Sensors (per slot)  
- OLED Display  
- Servo Motor (Gate)  
- Power Supply (5V)  

**Software Stack:**
- Frontend: HTML, CSS, JS  
- Backend: Node.js / PHP  
- Database: Firebase / MySQL / Blynk Cloud  
- API Integration: Blynk API, Razorpay API  
- QR Generation: JS (client) or Python/PHP (server)
  
🔄 Workflow
---------------
### 👤 User Side:
1. Register using email, name, password & vehicle number.  
2. Email verification ensures one-time secure access.  
3. On successful registration, a unique QR code is generated.  
4. View live slot availability on the dashboard.  
5. Drive to AUTOPARK → QR is scanned at the gate.  

### 🔐 Admin Side:
1. Web UI allows scanning QR codes.  
2. Automatically logs entry and exit time.  
3. If QR is valid, gate opens via servo motor.  
4. Parking cost calculated from entry-exit duration.  
5. Redirects user to EasyPay (Razorpay UPI Gateway).  

📡 Hardware Logic
---------------------
- **ESP8266 #1 (Display Controller)**:
  - Reads IR sensor values from each slot.
  - Updates OLED with slot availability & AUTOPARK animation.

- **ESP8266 #2 (Gate Controller)**:
  - Connects to Blynk Cloud.
  - Communicates with Admin UI and triggers servo based on scan validation.

🔐 Security Considerations
-------------------------------
- Email verification to prevent spoofing.  
- One-time registration per email.  
- QR codes mapped to hashed vehicle numbers.  
- Admin page secured with authentication.  
- Payments handled via trusted Razorpay API.  

🧪 Future Enhancements
-----------------------
- ✅ Add License Plate Recognition (LPR) via camera  
- 📱 Push notifications for slot alerts  
- 📍 Google Maps Integration for location-aware parking  
- 🔐 OTP-based login & 2FA  
- 🧠 AI-based slot prediction algorithm  

🛠️ Installation & Deployment
-----------------------------
1. Flash both ESP8266 with their respective `.ino` files using Arduino IDE.
Arduino IDE Link: https://www.arduino.cc/en/software/
ESP8266 board manager url: http://arduino.esp8266.com/stable/package_esp8266com_index.json 
3. Deploy web UIs (`AutoparkBase`, `AdminAutopark`) to local/cloud server.  
4. Configure Blynk template with correct tokens and device mappings.  
5. Connect Razorpay credentials in EasyPay backend.  
6. Test hardware with real-time sensor input.  

📬 Contact
--------------
**Jeet Chatterjee**  
Email: jeetchatterjee87066@gmail.com  
LinkedIn: https://www.linkedin.com/in/jeet-chatterjee84/
