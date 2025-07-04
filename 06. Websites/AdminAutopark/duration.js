// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgzQB81vMPNbEAY35LA5aNraLh-ZNN5D8",
  authDomain: "autoparkadmin.firebaseapp.com",
  projectId: "autoparkadmin",
  storageBucket: "autoparkadmin.appspot.com",
  messagingSenderId: "885714134036",
  appId: "1:885714134036:web:00364b44619c59ce1f3301",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

// Extract QR Data from URL
const params = new URLSearchParams(window.location.search);
const qrData = params.get("qrData");

if (!qrData) {
  alert("No QR code provided!");
  window.location.href = "index.html";
}

// DOM Elements
const vehicleIdEl = document.getElementById("vehicle-id");
const entryTimeEl = document.getElementById("entry-time");
const exitTimeEl = document.getElementById("exit-time");
const totalTimeEl = document.getElementById("total-time");

// Fetch Logs from Firestore
db.collection("parkingLogs")
  .doc(qrData)
  .get()
  .then((docSnapshot) => {
    if (docSnapshot.exists) {
      const logData = docSnapshot.data();

      const entryTimestamp = logData.entryTimestamp?.toDate();
      const exitTimestamp = logData.exitTimestamp?.toDate();

      if (entryTimestamp && exitTimestamp) {
        // Display Vehicle ID
        vehicleIdEl.textContent = qrData;

        // Convert timestamps to readable format
        entryTimeEl.textContent = entryTimestamp.toLocaleString();
        exitTimeEl.textContent = exitTimestamp.toLocaleString();

        // Calculate total duration
        const duration = Math.abs(exitTimestamp - entryTimestamp);
        const minutes = Math.floor(duration / (1000 * 60));
        const hours = Math.floor(minutes / 60);

        totalTimeEl.textContent = `${hours} hours and ${minutes % 60} minutes`;
      } else {
        alert("Incomplete logs for this vehicle!");
        window.location.href = "index.html";
      }
    } else {
      alert("No logs found for this vehicle!");
      window.location.href = "index.html";
    }
  })
  .catch((error) => {
    console.error("Error fetching logs:", error);
    alert("Failed to fetch parking logs.");
  });
