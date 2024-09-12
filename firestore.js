// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import * as FS from "https://www.gstatic.com/firebasejs/10.13/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyBQB1r3-qZl55cX9DobDni58uy9ncDBcgU",
    authDomain: "test-a4e83.firebaseapp.com",
    projectId: "test-a4e83",
    storageBucket: "test-a4e83.appspot.com",
    messagingSenderId: "313802864526",
    appId: "1:313802864526:web:ab9e8c42b8b8ca0c5556df",
    measurementId: "G-LNDVJXJ7J8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = FS.getFirestore(app);

window.getStatsForSong = async function (songId) {
    let out = {};
    let formats = ["aac", "mp3", "flac"];
    const collection = FS.collection(firestore, "responses");
    for (const format of formats) {
        const query = FS.query(collection, FS.where(songId, "==", format));
        const count = await FS.getCountFromServer(query);
        out[format] = count.data().count;
    }
    return out;
}

window.sendResponse = async function (response) {
    await FS.setDoc(
        FS.doc(firestore, "responses", crypto.randomUUID()),
        response
    )
}
