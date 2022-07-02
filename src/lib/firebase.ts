import { initializeApp } from "firebase/app"

const firebaseConfig = {
  apiKey: "AIzaSyASpfQRGWJK7JxKS9GgMZ3Qx63kVhCxUgs",
  authDomain: "shit6-voting.firebaseapp.com",
  projectId: "shit6-voting",
  storageBucket: "shit6-voting.appspot.com",
  messagingSenderId: "233556110990",
  appId: "1:233556110990:web:c25ed1b1f4c4352392a3df",
  measurementId: "G-N06K83XNPJ",
}

const firebaseApp = initializeApp(firebaseConfig)

export default firebaseApp
