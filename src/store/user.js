import { reactive, toRefs } from 'vue';
import { useRouter } from "vue-router";
import firebase from "firebase";
// Required for side-effects
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyAWDLDDTxbo1HV0sZwTE1Daml5teFGIhIA",
  authDomain: "vue-firebase-test-2e9c0.firebaseapp.com",
  projectId: "vue-firebase-test-2e9c0",
  storageBucket: "vue-firebase-test-2e9c0.appspot.com",
  messagingSenderId: "1057748161302",
  appId: "1:1057748161302:web:054576a0632912e67cb637"
};
firebase.initializeApp(config);

const state = reactive({
  user: null,
  initialized: false,
  error: null,
  userData: reactive({
    displayName: null,
    email: true,
    role: null,
    uid: null
  })
});



export default function () {
  const router = useRouter();
  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        state.user = null;
        router.push("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const authCheck = () => {
    return new Promise((resolve) => {
      !state.initialized &&
        firebase.auth().onAuthStateChanged(async (_user) => {
          if (_user) {
            state.user = _user;
            firebase.firestore().collection("users")
              .doc(_user.uid)
              .onSnapshot((doc) => {
                const _data = doc.data();
                console.log(_data);
                state.userData.displayName = _data.displayName;
                state.userData.email = _data.email;
                state.userData.role = _data.role;
                state.userData.uid = _data.uid;
              });
          } else {
            state.user = null;
          }
          state.initialized = true;
          console.log(_user);
          resolve(true);
        });
    });
  };
  return {
    ...toRefs(state),
    // FUNCTIONS
    logout,
    authCheck,
  };
}

