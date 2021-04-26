import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBJBKELsZvmXoz-mE60FuGu7c9eWu_XKJk',
  authDomain: 'hotel-revenue.firebaseapp.com',
  projectId: 'hotel-revenue',
  storageBucket: 'hotel-revenue.appspot.com',
  messagingSenderId: '122090478246',
  appId: '1:122090478246:web:5bb3d8b50a239a133cb267',
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
firebase.auth();
