// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyC5f2vPHEWAI2rNn1x2CpXirManrwS4-dI",
//     authDomain: "coffee-management-system-bae05.firebaseapp.com",
//     projectId: "coffee-management-system-bae05",
//     storageBucket: "coffee-management-system-bae05.appspot.com",
//     messagingSenderId: "87891901961",
//     appId: "1:87891901961:web:48b5441aff8d22c3c302d8",
//     measurementId: "G-KQXKEG6CC8"
//   };

///// Config của Anh 
const firebaseConfig = {
  apiKey: "AIzaSyDJKEAfDcMG_HAqxTYhnzqam9TVpJ2lmxY",
  authDomain: "mindx-web-intensive.firebaseapp.com",
  projectId: "mindx-web-intensive",
  storageBucket: "mindx-web-intensive.appspot.com",
  messagingSenderId: "328165486013",
  appId: "1:328165486013:web:674f796a1d8b3a38b3b6d4",
  measurementId: "G-F59RRV4K1S",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = firebase.auth();

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

// Initialize Cloud Storage and get a reference to the service
const storage = firebase.storage();
