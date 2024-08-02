// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBDQYBgwKYHM_2MngZbCrzzrywRoSaipz8",
	authDomain: "pantry-88dbe.firebaseapp.com",
	projectId: "pantry-88dbe",
	storageBucket: "pantry-88dbe.appspot.com",
	messagingSenderId: "457301037811",
	appId: "1:457301037811:web:4a4f50ea6f4f9f4581dd86",
	measurementId: "G-YHQWXE5Y9N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db }
