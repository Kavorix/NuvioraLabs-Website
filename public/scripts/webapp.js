// FIREBASE
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBrzabAxyTSzTUw8pP1cVzPkOih1a6I2EQ",
    authDomain: "cnute-b75af.firebaseapp.com",
    databaseURL: "https://cnute-b75af.firebaseio.com",
    projectId: "cnute-b75af",
    storageBucket: "cnute-b75af.appspot.com",
    messagingSenderId: "941484130837",
    appId: "1:941484130837:web:8e568f466246a763"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// MODULE
var awesweet = angular.module('awesweet', ['ngRoute', 'ngSanitize', 'ui.bootstrap', 'firebase']);
