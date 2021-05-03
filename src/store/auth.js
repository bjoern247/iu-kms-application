import { reactive, toRefs } from 'vue';
import firebase from 'firebase';

const state = reactive({
  user: null,
  loading: true,
  error: null
});

export default function auth() {
  firebase.auth().onAuthStateChanged(_user => {
    if (_user) {
      state.user = _user;
    } else {
      state.user = null;
    }
    state.loading = false;
  });

  return {
    ...toRefs(state)
  }
}