// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgzQB81vMPNbEAY35LA5aNraLh-ZNN5D8",
  authDomain: "autoparkadmin.firebaseapp.com",
  projectId: "autoparkadmin",
  storageBucket: "autoparkadmin.appspot.com",
  messagingSenderId: "885714134036",
  appId: "1:885714134036:web:00364b44619c59ce1f3301",
};

// ✅ Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

// ✅ Blynk API Configuration (Ensure Correct Token)
const BLYNK_AUTH_TOKEN = "DJgAqFG4bEqa-dMtpR6UocNK-5r8HJcr";  // Replace with actual Blynk token
const BLYNK_URL = `https://blynk.cloud/external/api/update?token=${BLYNK_AUTH_TOKEN}&V0=`;

// ✅ DOM Elements
const qrResult = document.getElementById("qr-result");
const logEntryBtn = document.getElementById("log-entry");
const logExitBtn = document.getElementById("log-exit");

// ✅ Start QR Scanner & Fix Camera Permission Issue
function startScanner() {
  navigator.mediaDevices.getUserMedia({ video: true }) // ✅ Request Camera Permission
    .then((stream) => {
      const videoElement = document.createElement("video");
      videoElement.srcObject = stream;
      videoElement.play();

      const html5QrCode = new Html5Qrcode("scanner");
      html5QrCode.start(
        { facingMode: "environment" }, // Back camera
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          console.log("Scanned text:", decodedText);
          qrResult.textContent = decodedText;
          logEntryBtn.disabled = false;
          logExitBtn.disabled = false;
        },
        (errorMessage) => {
          console.warn(`QR Code scan error: ${errorMessage}`);
        }
      ).catch((err) => {
        console.error("Error starting QR scanner:", err);
      });
    })
    .catch((error) => {
      console.error("Camera permission denied or not accessible:", error);
      alert("Please allow camera access for QR scanning.");
    });
}

// ✅ Call Scanner Function on Page Load
startScanner();

// ✅ Function to Send API Requests to Blynk
function sendBlynkRequest(url, action) {
  console.log(`Sending Blynk API request for ${action}:`, url);
  return fetch(url)
    .then(response => response.text())
    .then(text => {
      console.log(`Blynk API Response (${action}):`, text);
    })
    .catch(error => {
      console.error(`Error in Blynk API (${action}):`, error);
    });
}

// ✅ Function to Log Data to Firebase & Open Gate
function logToFirebase(type) {
  const qrData = qrResult.textContent;
  if (!qrData || qrData === "None") {
    alert("No QR code scanned!");
    return;
  }

  const currentTimestamp = firebase.firestore.Timestamp.now();
  const docRef = db.collection("parkingLogs").doc(qrData);

  if (type === "Entry") {
    docRef.set({ qrData, entryTimestamp: currentTimestamp }, { merge: true })
      .then(() => {
        alert("Entry logged successfully.");

        // 🚦 Open Gate for Entry
        sendBlynkRequest(BLYNK_URL + "180", "Gate Open").then(() => {
          setTimeout(() => {
            sendBlynkRequest(BLYNK_URL + "0", "Gate Close");
          }, 5000);
        });

        qrResult.textContent = "None";
        logEntryBtn.disabled = true;
        logExitBtn.disabled = true;
      })
      .catch((error) => {
        console.error("Error logging entry:", error);
        alert("Failed to log entry. Please try again.");
      });

  } else if (type === "Exit") {
    docRef.set({ qrData, exitTimestamp: currentTimestamp }, { merge: true })
      .then(() => {
        alert("Exit logged successfully.");

        // 🚦 Open Gate for Exit
        sendBlynkRequest(BLYNK_URL + "180", "Gate Open").then(() => {
          setTimeout(() => {
            sendBlynkRequest(BLYNK_URL + "0", "Gate Close").then(() => {
              // Redirect after closing gate
              window.location.href = `duration.html?qrData=${qrData}`;
            });
          }, 5000);
        });

      })
      .catch((error) => {
        console.error("Error logging exit:", error);
        alert("Failed to log exit. Please try again.");
      });
  }
}

// ✅ Button Event Listeners
logEntryBtn.addEventListener("click", () => logToFirebase("Entry"));
logExitBtn.addEventListener("click", () => logToFirebase("Exit"));
