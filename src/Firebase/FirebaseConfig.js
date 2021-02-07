import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/messaging";

var firebaseConfig = {
  apiKey: "AIzaSyBtKpn7vEemd3V0SCMJp7v6QcUAR5_Bh3s",
  authDomain: "fooddelivery-95b2e.firebaseapp.com",
  databaseURL: "https://fooddelivery-95b2e.firebaseio.com",
  projectId: "fooddelivery-95b2e",
  storageBucket: "fooddelivery-95b2e.appspot.com",
  messagingSenderId: "441958838421",
  appId: "1:441958838421:web:121226e3b50a11c9772b9c",
  measurementId: "G-SGKD8TXB95",
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storageRef = firebase.storage();
export const messaging = firebase.messaging();