import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import firebase from 'firebase'
require('./main.scss');

const config = {
  apiKey: "AIzaSyAWDLDDTxbo1HV0sZwTE1Daml5teFGIhIA",
  authDomain: "vue-firebase-test-2e9c0.firebaseapp.com",
  projectId: "vue-firebase-test-2e9c0",
  storageBucket: "vue-firebase-test-2e9c0.appspot.com",
  messagingSenderId: "1057748161302",
  appId: "1:1057748161302:web:054576a0632912e67cb637"
};

firebase.initializeApp(config);
createApp(App).use(router).mount('#app')
