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
                startAllListerners().then(() => {
                  console.log(courses);
                  resolve(true);
                })
              });
          } else {
            state.user = null;
            resolve(false);
          }
          state.initialized = true;
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

export const loadCourses = () => {
  return new Promise((resolve) => {
    const coursesSubscriber = courseCollection.onSnapshot(snapshot => {
      courses.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      console.log('Subscription happening');
      resolve(true);
    })
    subscribers.push(coursesSubscriber);
    return courses
  })
}

export const getCourses = () => {
  return courses
}

export const getCourse = (id) => {
  console.log(id);
  const course = courses.value.filter((item) => {
    return item.id === id
  })
  console.log(course);
  return course[0];
}

export const loadUsers = () => {
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
  return new Promise((resolve, reject) => {
    // Create array with found duplicates
    console.log(id);
    const duplicates = courses.value.filter((item) => {
      return id.includes(item.id)
    });
    // Check if duplicate array is empty or not
    if (duplicates.length === 0) {
      // Course doesn't exist yet, so we can create it
      courseCollection.doc().set({
        courseName: courseName,
        courseId: id,
        editors: []
      }).then(() => {
        resolve();
      }).catch((error) => {
        alert(error);
      });
    } else {
      // Course exists already
      alert('Dieser Kurs existiert bereits!');
      reject();
    }
  })
}

export const updateCourse = (doc, courseId, courseName) => {
  return new Promise((resolve, reject) => {
    courseCollection.doc(doc).update({
      courseName: courseName,
      courseId: courseId,
    }).then(() => {
      resolve(true);
    }).catch((error) => {
      alert(error);
      reject();
    });
  })
}

export const startAllListerners = () => {
  return new Promise((resolve) => {
    loadUsers();
    loadCourses().then(() => {
      resolve(true);
    })
  })
}

export const unsubscribeAllListeners = () => {
  // called by auth.js on user signout to unsubscribe all firestore realtime listeners
  console.log(subscribers);
  console.log('Unsubscribing all realtime listeners');
  subscribers.forEach(subscriber => subscriber());
}

