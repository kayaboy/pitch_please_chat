import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCKI4v9-3Qrhzf_H88-6mVJrHIaz5oa-lw",
    authDomain: "imessage-clone-2bc70.firebaseapp.com",
    projectId: "imessage-clone-2bc70",
    storageBucket: "imessage-clone-2bc70.appspot.com",
    messagingSenderId: "846823066144",
    appId: "1:846823066144:web:a8f6fad250fc7ef59eca45"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export {auth, provider};
export default db;
