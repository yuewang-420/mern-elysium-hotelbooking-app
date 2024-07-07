// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'mern-elysium.firebaseapp.com',
  projectId: 'mern-elysium',
  storageBucket: 'mern-elysium.appspot.com',
  messagingSenderId: '816127209720',
  appId: '1:816127209720:web:f5608f9741a7eeecb68b0d',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
