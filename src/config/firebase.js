// Firebase Configuration for Outtacouch

import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCb9Nc-4BsB3h9JDrkw8y6qQ64Wtzf9q6s",
  authDomain: "outtacouch-70c51.firebaseapp.com",
  projectId: "outtacouch-70c51",
  storageBucket: "outtacouch-70c51.firebasestorage.app",
  messagingSenderId: "679924218474",
  appId: "1:679924218474:web:0928c6ecbfcb1709a8a813",
  measurementId: "G-7RG1SYZ59B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with offline support
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

// Initialize Auth with React Native persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export default app;