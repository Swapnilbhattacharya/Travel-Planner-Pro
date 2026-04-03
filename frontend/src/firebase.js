import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2iWr3PoDjXRHqcpBJjvPXiPtNlEZnvlI",
  authDomain: "travel-planner-pro-80c3f.firebaseapp.com",
  projectId: "travel-planner-pro-80c3f",
  storageBucket: "travel-planner-pro-80c3f.firebasestorage.app",
  messagingSenderId: "609766397580",
  appId: "1:609766397580:web:4fd178033af64335f74da9"
};

const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);