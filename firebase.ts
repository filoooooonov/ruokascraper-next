// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADG3AQoFI62pymB8I8B00oNyGFUkE6-Mk",
  authDomain: "ruokascraper.firebaseapp.com",
  projectId: "ruokascraper",
  storageBucket: "ruokascraper.appspot.com",
  messagingSenderId: "565890443686",
  appId: "1:565890443686:web:75edce769f6b0b62154767",
  measurementId: "G-5JL52YFNTT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Cloud functions emulator
const functions = getFunctions(getApp());
connectFunctionsEmulator(functions, "127.0.0.1", 5001);
