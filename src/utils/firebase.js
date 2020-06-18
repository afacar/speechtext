import firebase from 'firebase';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE.API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE.AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE.DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE.PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE.STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE.MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE.APP_ID
};
// dev
// const firebaseConfig = {
//     apiKey: "AIzaSyAxFnX8s5XDtthKQDtnPanghyegQP7XvAY",
//     authDomain: "speechtext-dev0.firebaseapp.com",
//     databaseURL: "https://speechtext-dev0.firebaseio.com",
//     projectId: "speechtext-dev0",
//     storageBucket: "gs://speechtext-dev0.appspot.com",
//     messagingSenderId: "697602698646",
//     appId: "1:697602698646:web:194010f6ed9ebf8ac7c1b7"
// };

firebase.initializeApp(firebaseConfig);

export default firebase;