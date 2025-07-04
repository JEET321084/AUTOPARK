import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const auth = window.firebaseConfig.auth;
const db = window.firebaseConfig.db;

document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  function getFriendlyErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must include uppercase, lowercase, number, special character, and be 8-20 characters long.';
    case 'auth/missing-email':
      return 'Email is required.';
    case 'auth/internal-error':
      return 'An internal error occurred. Please try again.';
    default:
      return 'Registration failed. Please try again.';
  }
}


  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const vehicleNumber = document.getElementById("vehicleNumber").value.trim();
  const errorMessage = document.getElementById("errorMessage");

  // Password validation: at least 8 chars, uppercase, lowercase, number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
  if (!passwordRegex.test(password)) {
    errorMessage.textContent = "Password must include uppercase, lowercase, number, special character, and be 8-20 characters long.";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user);
    alert("Verification email sent. Please check your inbox.");

    // Save user info in Firestore
    await setDoc(doc(db, "users", user.uid), {
  name,
  email,
  vehicleNumber,
  uid: user.uid
});


    window.location.href = "login.html";

    } catch (error) {
    const friendlyMessage = getFriendlyErrorMessage(error.code);
    errorMessage.textContent = friendlyMessage;
    console.error("Registration error:", error.code, error.message);
  }
});
