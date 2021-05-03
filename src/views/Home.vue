<template>
<section class="hero is-light is-fullheight-with-navbar">
  <div class="home">
      <p class="is-size-2">Datenbankobjekt: {{data.phrase1}}</p>
      <p class="is-size-1">{{msg}}</p>
  </div>
</section>
</template>

<script>
import firebase from 'firebase';
import { ref } from 'vue';
export default {
  setup() {
    const msg = 'Hallo Welt';
    const data = ref('')
    // const userData = reactive({
    // });
    const db = firebase.firestore();
    db.collection('tests').doc('phrases').onSnapshot((doc) => {
      data.value = doc.data();
    });
    console.log(data);
    // console.log()
    // db.collection('users').doc('')
    return {
      data,
      msg
    }
  },
}
</script>