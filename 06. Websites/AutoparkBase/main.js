// Firebase Modular SDK v9+ Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCLRKChMnegQ4n26PTUXsGGbK6tJ_qSMVk",
  authDomain: "autopark-ebacf.firebaseapp.com",
  projectId: "autopark-ebacf",
  storageBucket: "autopark-ebacf.appspot.com",
  messagingSenderId: "993070646805",
  appId: "1:993070646805:web:cbe9e4715d5bed2bfa301c",
  measurementId: "G-0JVL1LJX6P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
  const authToken = 'DJgAqFG4bEqa-dMtpR6UocNK-5r8HJcr'; // Replace with your Blynk Auth Token
  const qrCodeImage = document.getElementById('qrCodeImage');
  const logoutBtn = document.getElementById('logoutBtn');

  // Function to fetch slot data from Blynk
  async function fetchSlotStatus() {
    for (let i = 1; i <= 4; i++) {
      const url = `https://blr1.blynk.cloud/external/api/get?token=${authToken}&V${i}`;
      try {
        const response = await fetch(url);
        const status = await response.text(); // Blynk returns plain text (not JSON)
        const slotElement = document.getElementById(`slot${i}`);
        if (status === '0') {
          slotElement.textContent = 'Occupied 🟥';
        } else if (status === '1') {
          slotElement.textContent = 'Available 🟩';
        } else {
          slotElement.textContent = 'Unknown';
        }
      } catch (error) {
        console.error(`Error fetching slot V${i}:`, error);
        const slotElement = document.getElementById(`slot${i}`);
        slotElement.textContent = 'Error';
      }
    }
  }

  // Show QR Code for the current user
  function generateUserQRCode(user) {
    const userDoc = doc(db, 'users', user.uid);
    getDoc(userDoc).then((docSnap) => {
      if (docSnap.exists()) {
        const vehicleNumber = docSnap.data().vehicleNumber;
        if (vehicleNumber) {
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(vehicleNumber)}`;
          qrCodeImage.src = qrUrl;
        } else {
          console.error('Vehicle number not found.');
        }
      } else {
        console.error('User document not found.');
      }
    }).catch((error) => {
      console.error('Error fetching Firestore document:', error);
    });
  }

  // Firebase Auth state observer
  onAuthStateChanged(auth, (user) => {
    if (user) {
      generateUserQRCode(user);
      fetchSlotStatus();
      setInterval(fetchSlotStatus, 2000); // Refresh every 2 sec
    } else {
      window.location.href = 'login.html';
    }
  });

  // Logout handler
  logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
      window.location.href = 'login.html';
    }).catch((error) => {
      console.error('Logout error:', error);
    });
  });
});
