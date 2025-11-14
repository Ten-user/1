import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Firebase config — production-ready with fallback to real values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey || "AIzaSyD3kWBiZ2qznhP4VKJfKuOGxHiWsK4jI3Y",
  authDomain: import.meta.env.VITE_authDomain || "career-d232c.firebaseapp.com",
  projectId: import.meta.env.VITE_projectId || "career-d232c",
  storageBucket: import.meta.env.VITE_storageBucket || "career-d232c.appspot.com",
  messagingSenderId: import.meta.env.VITE_messagingSenderId || "488035651405",
  appId: import.meta.env.VITE_appId || "1:488035651405:web:14d669c688ae74fa773104",
  measurementId: import.meta.env.VITE_measurementId || "G-VK6M68GG4K"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Analytics breaks on Netlify SSR — safe try/catch
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch {
  analytics = null;
}

export { app, auth, db, storage, analytics };
