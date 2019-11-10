import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyB3WVII6cEAbOz-k0U0i0KcmseIxKYAUpo",
  authDomain: "speechtext-72dfc.firebaseapp.com",
  databaseURL: "https://speechtext-72dfc.firebaseio.com",
  projectId: "speechtext-72dfc",
  storageBucket: "gs://speechtext-72dfc.appspot.com",
  messagingSenderId: "282156468695",
  appId: "1:282156468695:web:257c6a6595b6d7eb65a392"
};

firebase.initializeApp(firebaseConfig);

export default firebase;