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

firebase.initializeApp(firebaseConfig);

export default firebase;