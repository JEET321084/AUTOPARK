import { signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const auth = window.firebaseConfig.auth;

document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("errorMessage");
  const forgotMessage = document.getElementById("forgotMessage");
  errorMessage.textContent = "";
  forgotMessage.textContent = "";

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user.emailVerified) {
      // ✅ Replace with your target page
      window.location.href = "main.html";
    } else {
      await signOut(auth);
      errorMessage.textContent = "Please verify your email before logging in.";
    }

  } catch (error) {
    console.error("Login error code:", error.code);
    console.error("Login error message:", error.message);
    const friendlyMessage = getFriendlyLoginErrorMessage(error.code);
    errorMessage.textContent = friendlyMessage;
  }
});

function getFriendlyLoginErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return 'Login failed. Please check your credentials.';
  }
}

// ✅ Password reset event (MOVED OUTSIDE of submit handler)
document.getElementById("forgotPasswordLink").addEventListener("click", async function (e) {
  e.preventDefault();
  const email = prompt("Please enter your email address to reset your password:");
  const messageBox = document.getElementById("forgotMessage");
  const errorBox = document.getElementById("errorMessage");
  messageBox.textContent = "";
  errorBox.textContent = "";

  if (email) {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      messageBox.textContent = "Password reset email sent. Check your inbox.";
    } catch (error) {
      console.error("Password reset error:", error.code);
      if (error.code === 'auth/user-not-found') {
        errorBox.textContent = "No account found with this email.";
      } else if (error.code === 'auth/invalid-email') {
        errorBox.textContent = "Invalid email address.";
      } else {
        errorBox.textContent = "Failed to send reset email. Please try again.";
      }
    }
  }
});
