import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyDbbYt3Mo-UwrqleiDbZeKrKrQSpaavWxw",
    authDomain: "speechtext-io.firebaseapp.com",
    databaseURL: "https://speechtext-io.firebaseio.com",
    projectId: "speechtext-io",
    storageBucket: "gs://speechtext-io.appspot.com/",
    messagingSenderId: "936987129989",
    appId: "1:936987129989:web:4dc13f4d3b3deeab4051ec"
};

firebase.initializeApp(firebaseConfig);

export default firebase;