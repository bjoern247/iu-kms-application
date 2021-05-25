
import firebase from "firebase";
import { ref, onUnmounted } from 'vue';
// import { useRouter } from "vue-router";
// Required for side-effects
import "firebase/firestore";
const db = firebase.firestore();
// const usersCollection = db.collection('users');
const courseCollection = db.collection('courses');

export const useLoadCourses = () => {
  const courses = ref([])
  courseCollection.onSnapshot(snapshot => {
    courses.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  })
  onUnmounted(close)
  return courses
}

export const createCourse = (id, courseName) => {
  console.log(id)
  return courseCollection.doc(id).set({
    courseName: courseName,
    id: id
  }).then(() => {
  })
}

// export default function () {
//   const courses = firebase.firestore().collection('courses')
//     .get()
//     .then((querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//         return doc.data();
//         // const _data = doc.data();
//         // doc.data() is never undefined for query doc snapshots
//         // state.courses.push({ id: doc.id, courseName: _data.courseName })
//         // console.log(doc.id, " => ", doc.data());
//       });
//     })
//     .catch((error) => {
//       console.log("Error getting documents: ", error);
//     });
//   const users = firebase.firestore().collection('users')
//     .get()
//     .then((querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//         // const _data = doc.data();
//         // doc.data() is never undefined for query doc snapshots
//         // state.users.push({ uid: doc.id, displayName: _data.displayName, email: _data.email, role: _data.role })
//         console.log(doc.id, " => ", doc.data());
//       });
//     })
//     .catch((error) => {
//       console.log("Error getting documents: ", error);
//     });
//   return {
//     courses,
//     users
//   };
// }

