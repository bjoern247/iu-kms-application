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
const ticketCollection = db.collection('tickets');
const subscribers = ref([]);
const courseSubscribers = ref([]);
const courses = ref([]);
const tickets = ref([]);
const users = ref([]);
const unassignedEditors = ref([]);
const assignedEditors = ref([]);
const backButtonDisabled = ref(false);

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
                startAllListeners().then(() => {
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

// Admin
export const loadAllCourses = () => {
  console.log('Courses listener started');
  return new Promise((resolve) => {
    const coursesSubscriber = courseCollection.onSnapshot(snapshot => {
      courses.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      resolve(true);
    })
    subscribers.value.push(coursesSubscriber);
    return courses
  })
}

// Student (only for ticket-creation)
export const loadAllCourseIds = () => {
  return new Promise((resolve) => {
    const coursesSubscriber = courseCollection.onSnapshot(snapshot => {
      courses.value = snapshot.docs.map(doc => ({ id: doc.id, courseId: doc.data().courseId }))
      resolve(true);
    })
    subscribers.value.push(coursesSubscriber);
    return courses
  })
}

// Editor
export const loadMyCourses = () => {
  console.log('Courses listener started');
  return new Promise((resolve) => {
    const coursesSubscriber = courseCollection.where("editors", "array-contains", state.userData.uid).onSnapshot(snapshot => {
      courses.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      resolve(true);
    })
    subscribers.value.push(coursesSubscriber);
    return courses
  })
}

export const getCourses = () => {
  console.log(courses);
  return courses
}

// Admin
export const loadAllTickets = () => {
  console.log('Ticket listener started');
  return new Promise((resolve) => {
    const ticketsSubscriber = ticketCollection.onSnapshot(snapshot => {
      tickets.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      resolve(true);
    })
    subscribers.value.push(ticketsSubscriber);
    return tickets
  })
}

// Editor
export const loadAssignedTickets = async () => {
  const courses = await getAssignedCourses();
  if (courses.length != 0) {
    console.log('Ticket listener started');
    return new Promise((resolve) => {
      const ticketsSubscriber = ticketCollection.where("courseId", "in", courses).onSnapshot(snapshot => {
        tickets.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        resolve(true);
      })
      subscribers.value.push(ticketsSubscriber);
      return tickets
    })
  }
}

// Returns assigned courses for editors
export const getAssignedCourses = () => {
  console.log("getting assigned courses");
  return new Promise((resolve) => {
    userCollection.doc(state.userData.uid).get().then((doc) => {
      console.log(doc.data().courses);
      resolve(doc.data().courses);
    });
  })
}

export const loadCreatedTickets = () => {
  console.log('Ticket listener started');
  return new Promise((resolve) => {
    const ticketsSubscriber = ticketCollection.where("createdBy", "==", state.userData.uid).onSnapshot(snapshot => {
      tickets.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      resolve(true);
    })
    subscribers.value.push(ticketsSubscriber);
    return tickets
  })
}

export const getTickets = () => {
  console.log(tickets);
  return tickets
}

export const getCourseDocById = (courseId) => {
  console.log(courseId);
  return new Promise((resolve, reject) => {
    courseCollection.where("courseId", "==", courseId).get().then((querySnapshot) => {
      let docId = 'none'
      querySnapshot.forEach((doc) => {
        docId = doc.id;
      });
      console.log(docId);
      resolve(docId);
    }).catch((error) => {
      console.log("Error getting documents: ", error);
      reject();
  });
  })
}

export const getCourse = (id) => {
  console.log(id);
  const course = courses.value.filter((item) => {
    return item.id === id
  })
  return course[0];
}

export const loadUsers = () => {
  console.log('Users listener started');
  return new Promise((resolve) => {
    const usersSubscriber = userCollection.onSnapshot(snapshot => {
      users.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      resolve(true);
    })
    subscribers.value.push(usersSubscriber);
    return users
  })
}

export const getUsers = () => {
  return users
}

export const loadUnassignedEditors = (course) => {
  return new Promise((resolve) => {
    const unassignedEditorsQuery = userCollection.where("role", "==", "editor").onSnapshot(querySnapshot => {
      const editors = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      unassignedEditors.value = editors.filter((item) => {
        return !item.courses.includes(course);
      });
      resolve(true);
    })
    courseSubscribers.value.push(unassignedEditorsQuery);
    return unassignedEditors;
  })
}

export const loadAssignedEditors = (course) => {
  return new Promise((resolve) => {
    const assignedEditorsQuery = userCollection.where("courses", "array-contains", course).onSnapshot(querySnapshot => {
      assignedEditors.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      resolve(true);
    })
    courseSubscribers.value.push(assignedEditorsQuery);
    return assignedEditors
  })
}

export const getAssignedEditors = () => {
  return assignedEditors;
}

export const getUnassignedEditors = () => {
  return unassignedEditors
}

export const getUser = (id) => {
  console.log(id);
  const user = users.value.filter((item) => {
    return item.uid === id
  })
  console.log(user[0]);
  return user[0];
}

// Edit user
export const updateUser = (doc, role) => {
  return new Promise((resolve, reject) => {
    userCollection.doc(doc).update({
      role: role
    }).then(() => {
      resolve(true);
    }).catch((error) => {
      alert(error);
      reject();
    });
  })
}

// Create Ticket
export const createTicket = async (name, text, category, courseId) => {
  const docId = await getCourseDocById(courseId);
  console.log(docId);
  return new Promise((resolve, reject) => {
    ticketCollection.doc().set({
      ticketName: name,
      ticketText: text,
      ticketCategory: category,
      courseDocId: docId,
      courseId: courseId,
      datetime: new Date(),
      createdBy: state.userData.uid
    }).then(() => {
      resolve();
    }).catch((error) => {
      alert(error);
      reject();
    });
  })
}

// Create course
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

// Edit course
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

// Delete course
export const deleteCourse = (doc) => {
  return new Promise((resolve, reject) => {
    courseCollection.doc(doc).delete().then(() => {
      resolve(true);
      disableBackButton();
    }).catch((error) => {
      alert(error);
      reject();
    })
  })
}

// Assign user as an editor for selected course
export const assignEditor = async (uid, course, courseId) => {
  await userCollection.doc(uid).update({
    courses: firebase.firestore.FieldValue.arrayUnion(courseId)
  }).catch((error) => {
    alert(error);
  })
  await courseCollection.doc(course).update({
    editors: firebase.firestore.FieldValue.arrayUnion(uid)
  }).catch((error) => {
    alert(error);
  })
  console.log("Editor assigned");
}

// Unassign user as an editor for selected course
export const unassignEditor = async (uid, course, courseId) => {
  await userCollection.doc(uid).update({
    courses: firebase.firestore.FieldValue.arrayRemove(courseId)
  }).catch((error) => {
    alert(error);
  })
  await courseCollection.doc(course).update({
    editors: firebase.firestore.FieldValue.arrayRemove(uid)
  }).catch((error) => {
    alert(error);
  })
  console.log("Editor unassigned");
}

export const startAllListeners = async () => {
  await loadUsers();
  if (state.userData.role === 'admin') {
    await loadAllCourses();
    await loadAllTickets();
  }
  else if (state.userData.role === 'editor') {
    await loadMyCourses();
    await loadAssignedTickets();
  }
  else if (state.userData.role === 'student') {
    await loadAllCourseIds();
    await loadCreatedTickets();
  }
}

export const startCourseListeners = (course) => {
  console.log('Course listeners started');
  loadAssignedEditors(course)
  loadUnassignedEditors(course);
}

export const stopCourseListeners = () => {
  courseSubscribers.value.forEach(subscriber => subscriber());
  courseSubscribers.value = [];
  console.log('Course listeners stopped');
}

export const disableBackButton = () => {
  backButtonDisabled.value = true;
}

export const enableBackButton = () => {
  backButtonDisabled.value = false;
}

export const getbackButtonState = () => {
  return backButtonDisabled;
}

export const unsubscribeAllListeners = () => {
  // called by auth.js on user signout to unsubscribe all firestore realtime listeners
  subscribers.value.forEach(subscriber => subscriber());
  subscribers.value = [];
  console.log('Stopped all realtime listeners');
}

