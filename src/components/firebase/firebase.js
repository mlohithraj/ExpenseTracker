// Import the functions you need from the SDKs you need
import firebase from 'firebase'

const firebaseConfig = {
  apiKey: 'AIzaSyAyA-q0e_kzrsBi07QnurND_HsTyTaiZBw',
  authDomain: 'expense-tracker-c30e4.firebaseapp.com',
  databaseURL:
    'https://expense-tracker-c30e4-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'expense-tracker-c30e4',
  storageBucket: 'expense-tracker-c30e4.appspot.com',
  messagingSenderId: '635170286411',
  appId: '1:635170286411:web:f42269dfae75baf64396ce',
  measurementId: 'G-KBPC0H2G0N',
};

// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);
export default fire;
