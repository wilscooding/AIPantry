import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyBDQYBgwKYHM_2MngZbCrzzrywRoSaipz8",
	authDomain: "pantry-88dbe.firebaseapp.com",
	projectId: "pantry-88dbe",
	storageBucket: "pantry-88dbe.appspot.com",
	messagingSenderId: "457301037811",
	appId: "1:457301037811:web:4a4f50ea6f4f9f4581dd86",
	measurementId: "G-YHQWXE5Y9N",
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { db, storage };
