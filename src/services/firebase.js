import firebase from 'firebase';
import 'firebase/auth'
import 'firebase/database'

const config = {
    apiKey: "AIzaSyAD9nv1kbfA9uUs_7cKLmCrR_Dq1uCp3es",
    authDomain: "chatty-eaec0.firebaseapp.com",
    databaseURL: "https://chatty-eaec0.firebaseio.com",
    projectId: "chatty-eaec0",
    storageBucket: "chatty-eaec0.appspot.com",
    messagingSenderId: "667690122022",
    appId: "1:667690122022:web:580e85f058b692d10edfe7",
    measurementId: "G-CVBRG7HMBK"
};
firebase.initializeApp(config);
firebase.analytics();
export const auth = firebase.auth;
export const db = firebase.database();
