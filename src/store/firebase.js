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

// Variables
const db = firebase.firestore();
const courseCollection = db.collection('courses');
const userCollection = db.collection('users');
const ticketCollection = db.collection('tickets');
const subscribers = ref([]);
const collectionListeners = ref([]);
const ticketSubscribers = ref([]);
const userSubscribers = ref([]);
const courses = ref([]);
const tickets = ref([]);
const assignedTickets = ref([]);
const ticket = ref();
const users = ref([]);
const user = ref();
const unassignedEditors = ref([]);
const assignedEditors = ref([]);
const backButtonDisabled = ref(false);
// User State Object
const state = reactive({
  user: null,
  initialized: false,
  error: null,
  userData: reactive({
    displayName: null,
    email: true,
    role: null,
    uid: null,
    deactivated: false,
    appLoaded: false
  })
});
// Ticket State Object
const studentTicketState = reactive({
  created: null,
  validated: null
});

const editorTicketState = reactive({
  created: null,
  validated: null
});
const adminUserState = reactive({
  total: null,
  deactivated: null
})

// AUTHENTICATION STATE MANAGEMT
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
        state.userData.appLoaded = false;
        state.userData.displayName = null;
        state.userData.role = null;
        state.userData.uid = null;
        state.userData.email = null;
        state.userData.deactivated = false;
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
                state.userData.deactivated = _data.deactivated;
                console.log("AuthCheck");
                startAllListeners().then(() => {
                  console.log(courses);
                  state.userData.appLoaded = true;
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

/*
USER
*/

// Admin: Load all users from firestore
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

// Admin: Load specific user from firestore
export const loadUser = (id) => {
  console.log('Specific user listener started');
  return new Promise((resolve) => {
    const userSubscriber = userCollection.doc(id).onSnapshot(doc => {
      user.value = doc.data();
      resolve(doc.data());
      console.log(user.value);
    })
    userSubscribers.value.push(userSubscriber);
    return user
  })
}


// GET-Method for component
export const getUsers = () => {
  return users
}

// GET-Method for component
export const getUser = () => {
  return user
}

export const getUserData = () => {
  return state.userData;
}

// Admin: Edit role of user
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

//Admin: Deactivate/Reactivate user
export const toggleUserDeactivation = (uid) => {
  console.log(uid);
  return new Promise((resolve, reject) => {
    userCollection.doc(uid).get().then(function (doc) {
      if (doc.exists) {
        console.log(doc.data().deactivated);
        return doc.ref.update({
          deactivated: !doc.data().deactivated
        });
      }
    }).then(() => {
      resolve(true);
    }).catch((error) => {
      alert(error);
      reject
    })
  });
}


/*
TICKETS
*/

// Admin: Loads all tickets into tickets variable
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

// Editor: loads all tickets that are created in assigned courses and are not assigned yet
export const loadUnassignedTickets = async () => {
  const courses = await getAssignedCourses(); // Editor's assigned courses
  if (courses.length != 0) {
    console.log('Ticket Collection listener started');
    return new Promise((resolve) => {
      const ticketsSubscriber = ticketCollection.where("courseId", "in", courses).where("ticketEditor", "==", "").onSnapshot(snapshot => {
        tickets.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        resolve(true);
      }) // Query for all tickets in courses that Editor has assigned to himself
      subscribers.value.push(ticketsSubscriber);
      return tickets
    })
  }
}

// Editor: loads assigned tickets
export const loadAssignedTickets = async () => {
  const courses = await getAssignedCourses(); // Editor's assigned courses
  if (courses.length != 0) {
    console.log('Ticket Collection listener started');
    return new Promise((resolve) => {
      const ticketsSubscriber = ticketCollection.where("courseId", "in", courses).where("ticketEditor", "==", state.userData.uid).onSnapshot(snapshot => {
        assignedTickets.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        resolve(true);
      }) // Query for all tickets in courses that Editor has assigned to himself
      subscribers.value.push(ticketsSubscriber);
      return assignedTickets
    })
  }
}

// Student: Load all tickets created by user
export const loadCreatedTickets = () => {
  console.log('Ticket collection listener started');
  return new Promise((resolve) => {
    const ticketsSubscriber = ticketCollection.where("createdBy", "==", state.userData.uid).onSnapshot(snapshot => {
      tickets.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      resolve(true);
    }) // Query for all tickets created by specified user
    subscribers.value.push(ticketsSubscriber);
    return tickets
  })
}

export const loadTicket = async (id) => {
  console.log("Specific Ticket listener started()");
  return new Promise((resolve) => {
    const ticketSubscriber = ticketCollection.doc(id).onSnapshot(doc => {
      ticket.value = doc.data();
      resolve(doc.data());
      console.log(ticket.value);
    })
    ticketSubscribers.value.push(ticketSubscriber);
    return ticket
  })
}


// GET-Method for component access
export const getTicket = () => {
  return ticket;
}

// GET-Method for component access
export const getStudentTicketState = () => {
  return studentTicketState;
}

// GET-Method for component access
export const getEditorTicketState = () => {
  return editorTicketState;
}

// GET-Method for component access
export const getAdminUserState = () => {
  return adminUserState;
}

/* 
Helper Methods for filtering ticket array to get amount of tickets in different states
*/
export const getStudentAmountCreated = () => {
  return new Promise((resolve) => {
    const ticketStudentAmountCreatedListener = ticketCollection.where("createdBy", "==", state.userData.uid).where("ticketStatus", "==", "created").onSnapshot(snapshot => {
      const created = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      studentTicketState.created = created.length
      resolve(true);
    }) // Query for all tickets created by specified user
    subscribers.value.push(ticketStudentAmountCreatedListener);
    return null;
  })
}
export const getStudentAmountValidated = () => {
  return new Promise((resolve) => {
    const ticketStudentAmountValidatedListener = ticketCollection.where("createdBy", "==", state.userData.uid).where("ticketStatus", "==", "validated").onSnapshot(snapshot => {
      const validated = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      studentTicketState.validated = validated.length
      resolve(true);
    }) // Query for all tickets created by specified user
    subscribers.value.push(ticketStudentAmountValidatedListener);
    return null;
  })
}
export const getEditorAmountCreated = async () => {
  const courses = await getAssignedCourses(); // Editor's assigned courses
  if (courses.length != 0) {
    console.log('Ticket Collection listener started');
    return new Promise((resolve) => {
      const ticketEditorAmountCreatedListener = ticketCollection.where("courseId", "in", courses).where("ticketStatus", "==", "created").onSnapshot(snapshot => {
        const created = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        editorTicketState.created = created.length
        resolve(true);
      }) // Query for all tickets in courses that Editor has assigned to himself
      subscribers.value.push(ticketEditorAmountCreatedListener);
      return null
    })
  }
}
export const getEditorAmountValidated = async () => {
  const courses = await getAssignedCourses(); // Editor's assigned courses
  if (courses.length != 0) {
    console.log('Ticket Collection listener started');
    return new Promise((resolve) => {
      const ticketEditorAmountValidatedListener = ticketCollection.where("courseId", "in", courses).where("ticketStatus", "==", "validated").where("ticketEditor", "==", state.userData.uid).onSnapshot(snapshot => {
        const validated = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        editorTicketState.validated = validated.length
        resolve(true);
      }) // Query for all tickets created by specified user
      subscribers.value.push(ticketEditorAmountValidatedListener);
      return null
    })
  }
}
export const getAdminUsersDeactivated = async () => {
  return new Promise((resolve) => {
    const deactivatedUsersListener = userCollection.where("deactivated", "==", true).onSnapshot(snapshot => {
      const deactivatedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      adminUserState.deactivated = deactivatedUsers.length
      resolve(true);
    }) // Query for all tickets created by specified user
    subscribers.value.push(deactivatedUsersListener);
    return null
  })
}

// GET-Method for component access
export const getTickets = () => {
  return tickets
}

// GET-Method for component access
export const getAssignedTickets = () => {
  return assignedTickets
}

// Load Course-IDs for ticket creation (Dropdown: Select Course)
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

// Helper Method to write course document id into newly created tickets
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

// Create ticket
export const createTicket = async (name, text, category, courseId) => {
  const docId = await getCourseDocById(courseId);
  console.log(docId);
  return new Promise((resolve, reject) => {
    let newTicketRef = ticketCollection.doc();
    newTicketRef.set({
      ticketName: name,
      ticketText: text,
      ticketCategory: category,
      ticketId: newTicketRef.id,
      ticketStatus: 'created',
      ticketEditor: '',
      courseDocId: docId,
      courseId: courseId,
      datetime: new Date(),
      createdBy: state.userData.uid,
      creatorMail: state.userData.email,
      ticketLog: ['Erstellt: ' + new Date().toLocaleDateString('de-DE', {
        day: 'numeric',
        year: 'numeric',
        month: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
      })]
    }).then(() => {
      console.log("Ticket sucessfully created")
      resolve();
    }).catch((error) => {
      alert(error);
      reject();
    });
  })
}

// Validate ticket (next step in ticket lifecycle)
export const validateTicket = (id) => {
  return new Promise((resolve, reject) => {
    ticketCollection.doc(id).update({
      ticketStatus: 'validated',
      ticketLog: firebase.firestore.FieldValue.arrayUnion('An Bearbeiter zugewiesen: ' + new Date().toLocaleDateString('de-DE', {
        day: 'numeric',
        year: 'numeric',
        month: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
      })),
      ticketEditor: state.userData.uid,
      ticketEditorMail: state.userData.email,
      ticketEditorName: state.userData.displayName
    }).then(() => {
      resolve(true);
    }).catch((error) => {
      alert(error);
      reject(error);
    });
  })
}

// Close ticket (last step in ticket lifecycle)
export const closeTicket = (id, comment) => {
  return new Promise((resolve, reject) => {
    ticketCollection.doc(id).update({
      ticketStatus: 'closed',
      ticketClosingDate: new Date(),
      ticketLog: firebase.firestore.FieldValue.arrayUnion('Ticket geschlossen: ' + new Date().toLocaleDateString('de-DE', {
        day: 'numeric',
        year: 'numeric',
        month: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
      })),
      ticketClosingComment: comment
    }).then(() => {
      resolve(true);
    }).catch((error) => {
      alert(error);
      reject(error);
    });
  })
}

// Admin: Reactivate ticket after it was wrongfully flagged for deletion by an editor
export const reactivateTicket = (id) => {
  return new Promise((resolve, reject) => {
    ticketCollection.doc(id).update({
      ticketStatus: 'created',
      ticketLog: firebase.firestore.FieldValue.arrayUnion('Reaktiviert: ' + new Date().toLocaleDateString('de-DE', {
        day: 'numeric',
        year: 'numeric',
        month: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
      })),
      ticketEditor: ''
    }).then(() => {
      resolve(true);
    }).catch((error) => {
      alert(error);
      reject(error);
    });
  })
}

// Allows editor to flag tickets for deletion by an Admin
export const flagTicketForDeletion = (id) => {
  return new Promise((resolve, reject) => {
    ticketCollection.doc(id).update({
      ticketStatus: 'awaiting deletion',
      ticketLog: firebase.firestore.FieldValue.arrayUnion('Löschung beantragt: ' + new Date().toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
    }).then(() => {
      resolve(true);
    }).catch((error) => {
      alert(error);
      reject(error);
    });
  })
}

// Delete ticket
export const deleteTicket = (id) => {
  return new Promise((resolve, reject) => {
    ticketCollection.doc(id).delete().then(() => {
      resolve(true);
      disableBackButton();
    }).catch((error) => {
      alert(error);
      reject(error);
    })
  })
}

/* 
COURSES
*/

// Admin: Load all courses from firestore
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

// Editor: Load all assigned courses from firestore
export const loadMyCourses = () => {
  console.log('Courses listener started');
  return new Promise((resolve) => {
    const coursesSubscriber = courseCollection.where("editors", "array-contains", state.userData.uid).onSnapshot(snapshot => {
      courses.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      resolve(true);
    }) // Query for courses where editors' array contains currently authenticated user's uid
    subscribers.value.push(coursesSubscriber);
    return courses
  })
}

// GET-Method for component
export const getCourses = () => {
  return courses
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

export const getCourse = (id) => {
  // realtime updates not needed here (ticket is different)
  console.log("getCourse()");
  console.log(courses.value);
  const course = courses.value.filter((item) => {
    return item.id === id
  })
  return course[0];
}

// Returns all editors that are not assigned to specified course
export const loadUnassignedEditors = (course) => {
  return new Promise((resolve) => {
    const unassignedEditorsQuery = userCollection.where("role", "==", "editor").onSnapshot(querySnapshot => {
      const editors = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      unassignedEditors.value = editors.filter((item) => {
        return !item.courses.includes(course);
      });
      resolve(true);
    })
    collectionListeners.value.push(unassignedEditorsQuery);
    return unassignedEditors;
  })
}

// Returns assigned editors for specified course
export const loadAssignedEditors = (course) => {
  return new Promise((resolve) => {
    const assignedEditorsQuery = userCollection.where("courses", "array-contains", course).onSnapshot(querySnapshot => {
      assignedEditors.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      resolve(true);
    })
    collectionListeners.value.push(assignedEditorsQuery);
    return assignedEditors
  })
}

// GET-Method for component
export const getAssignedEditors = () => {
  return assignedEditors;
}

// GET-Method for component
export const getUnassignedEditors = () => {
  return unassignedEditors
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

// Edit course details
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

// Assign user as an editor for specified course
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

// Unassign user as an editor for specified course
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

/*
LISTENER MANAGEMENT
*/

// Role based loading
export const startAllListeners = async () => {
  await loadUsers();
  if (state.userData.role === 'admin') {
    await loadAllCourses();
    await loadAllTickets();
    getAdminUsersDeactivated(); // realtime deactivated users number for admin home view
  }
  else if (state.userData.role === 'editor') {
    await loadMyCourses();
    await loadUnassignedTickets();
    await loadAssignedTickets();
    getEditorAmountCreated(); // realtime created tickets ready for validation for editor home view
    getEditorAmountValidated(); // realtime validated tickets ready for working on for editor home view
  }
  else if (state.userData.role === 'student') {
    await loadAllCourseIds();
    await loadCreatedTickets();
    getStudentAmountCreated(); // realtime created tickets number for student home view
    getStudentAmountValidated(); // realtime validated tickets number for student home view
  }
}

// Attaching listeners 
export const startCourseListeners = (course) => {
  console.log('Course listeners started');
  loadAssignedEditors(course)
  loadUnassignedEditors(course);
}

// Detaching listeners when no longer needed to save operations
export const stopCourseListeners = () => {
  collectionListeners.value.forEach(subscriber => subscriber());
  collectionListeners.value = [];
  console.log('Course listeners stopped');
}

// For detaching specific realtime ticket listener
export const stopTicketListeners = () => {
  ticketSubscribers.value.forEach(subscriber => subscriber());
  ticketSubscribers.value = [];
  console.log('Specific ticket listener(s) stopped');
}

export const stopUserListeners = () => {
  userSubscribers.value.forEach(subscriber => subscriber());
  userSubscribers.value = [];
  console.log('Specific user listener(s) stopped');
}

export const disableBackButton = () => {
  backButtonDisabled.value = true;
}

export const enableBackButton = () => {
  backButtonDisabled.value = false;
}

// GET-Method for App.vue component to recieve state
export const getbackButtonState = () => {
  return backButtonDisabled;
}

// Detach all realtime listeners, for example when logging user out
export const unsubscribeAllListeners = () => {
  stopTicketListeners();
  stopCourseListeners();
  stopUserListeners();
  // called by auth.js on user signout to unsubscribe all firestore realtime listeners
  subscribers.value.forEach(subscriber => subscriber());
  subscribers.value = [];
  console.log('Stopped all realtime listeners');
}

