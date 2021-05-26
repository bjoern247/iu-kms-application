import { reactive, toRefs, ref } from 'vue';
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

const db = firebase.firestore();
// const usersCollection = db.collection('users');
const courseCollection = db.collection('courses');
const userCollection = db.collection('users');
const subscribers = [];
const courses = ref([]);
const users = ref([]);

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
        // clear data store
        state.user = null;
        state.initialized = false;
        state.error = null;
        router.push("/login");
        unsubscribeAllListeners();
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
            userCollection
              .doc(_user.uid)
              .onSnapshot((doc) => {
                const _data = doc.data();
                console.log(_data);
                state.userData.displayName = _data.displayName;
                state.userData.email = _data.email;
                state.userData.role = _data.role;
                state.userData.uid = _data.uid;
                console.log("AuthCheck");
                startAllListerners();
              });
          } else {
            state.user = null;
          }
          state.initialized = true;
          resolve(true);
        });
    });
  };
  return {
    ...toRefs(state),
    // FUNCTIONS
    logout,
    authCheck,
    courses,
    users
  };
}

export const useLoadCourses = () => {
  const coursesSubscriber = courseCollection.onSnapshot(snapshot => {
    courses.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    console.log('Subscription happening');
  })
  subscribers.push(coursesSubscriber);
  return courses
}

export const getCourses = () => {
  return courses
}

export const useLoadUsers = () => {
  const usersSubscriber = userCollection.onSnapshot(snapshot => {
    users.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    console.log('Subscription happening');
  })
  subscribers.push(usersSubscriber);
  return users
}

export const getUsers = () => {
  return users
}

export const createCourse = (id, courseName) => {
  console.log(id)
  return courseCollection.doc(id).set({
    courseName: courseName,
    id: id
  }).then(() => {
  })
}

export const startAllListerners = () => {
  useLoadCourses();
  useLoadUsers();
}
export const unsubscribeAllListeners = () => {
  // called by auth.js on user signout to unsubscribe all firestore realtime listeners
  console.log(subscribers);
  console.log('Unsubscribing all realtime listeners');
  subscribers.forEach(subscriber => subscriber());
}

