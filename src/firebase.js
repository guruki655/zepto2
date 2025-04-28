// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOOqGHoqdkqmeLJpkrKMg5NL3EwEgQhdw",
  authDomain: "zepto2-e8b6d.firebaseapp.com",
  projectId: "zepto2-e8b6d",
  storageBucket: "zepto2-e8b6d.firebasestorage.app",
  messagingSenderId: "738376777608",
  appId: "1:738376777608:web:e72b676c8c75add3b7843d",
  measurementId: "G-T85BSYN4CL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Export the necessary modules for use in your Register.js or other components
export { auth, RecaptchaVerifier, signInWithPhoneNumber };
