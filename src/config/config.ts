// import { configure as mobxConfigure } from 'mobx';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { initFirestorter } from 'firestorter';
// import { configureDevtool } from 'mobx-react-devtools';

// don't allow state modifications outside actions
// mobxConfigure({ enforceActions: 'observed' });

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyC3WdZVC19Hv8jjEHvkr2_EHn10MMkkCVo',
  authDomain: 'lickstance.firebaseapp.com',
  databaseURL: 'https://lickstance.firebaseio.com',
  projectId: 'lickstance',
  storageBucket: 'lickstance.appspot.com',
  messagingSenderId: '1089194237802',
};
firebase.initializeApp(firebaseConfig);

// Initialize `firestorter`
initFirestorter({ firebase });

// Any configurations are optional
// configureDevtool({
//   // Insert configurations.
// });
