import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import useFirebaseAuth from "./store/firebase";
require('./main.scss');

const { authCheck } = useFirebaseAuth();

const app = createApp(App);

authCheck()
  .then(() => {
    app.use(router);
    app.mount('#app');
  }
);


