<template>
  <p class="is-size-2">Hallo, {{ email }}</p>
  <div class="columns is-centered is-vcentered">
    <div
      class="column is-half-desktop is-one-third-widescreen is-one-quarter-fullhd"
    >
      <div class="box">
        <p class="title">Tickets</p>
        <div class="buttons is-grouped is-centered">
          <router-link to="/create-ticket" class="button is-primary">
            <span class="icon is-small">
              <i class="fas fa-plus"></i>
            </span>
            <span>Erstellen</span>
          </router-link>
          <router-link to="/tickets" class="button is-primary">
            <span class="icon is-small">
              <i class="far fa-edit"></i>
            </span>
            <span>Verwalten</span>
          </router-link>
        </div>
      </div>
    </div>
    <div
      class="column is-half-desktop is-one-third-widescreen is-one-quarter-fullhd"
    >
      <div class="box">
        <p class="title">Verwaltung</p>
        <div class="buttons is-grouped is-centered">
          <router-link class="button is-primary" to="/settings">
            <span class="icon is-small">
              <i class="fas fa-arrow-right"></i>
            </span>
            <span>Passwort ändern</span>
          </router-link>
          <a class="button is-danger" @click="logout()">Logout</a>
        </div>
      </div>
    </div>
  </div>
  <p class="is-size-2">Datenbank-Realtimeobjekt : {{ data.phrase1 }}</p>
</template>

<script>
import auth from "../../store/auth";
import firebase from "firebase";
import { ref } from "vue";
import { useRouter } from "vue-router";
export default {
  name: "StudentView",
  setup() {
    const data = ref("");
    const router = useRouter();
    let userAuthObject = auth();
    let user = userAuthObject.user.value;
    const email = user.email;
    // const userData = reactive({
    // });
    const db = firebase.firestore();
    db.collection("tests")
      .doc("phrases")
      .onSnapshot((doc) => {
        data.value = doc.data();
      });
    // console.log()
    // db.collection('users').doc('')
    function logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          router.push("/login");
        })
        .catch((error) => {
          console.log(error);
        });
    }
    return {
      email,
      data,
      logout,
    };
  },
};
</script>