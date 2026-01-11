import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDRFCEcrxi6zuxGZfK725yx4Nn_LRS9PO8",
  authDomain: "payment-calculator-577d1.firebaseapp.com",
  projectId: "payment-calculator-577d1",
  storageBucket: "payment-calculator-577d1.firebasestorage.app",
  messagingSenderId: "230239579090",
  appId: "1:230239579090:web:8c89afd8cf93870c18f60b",
  measurementId: "G-Z5QT43MBBX"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
