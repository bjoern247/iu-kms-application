<template>
  <div class="home">
    <p class="is-size-2">Hallo, {{ email }}</p>
    <div class="columns">
      <div class="column">
        <div class="card">
          <div class="card-content">
            <p class="title">Ticket erstellen</p>
            <p class="subtitle">
              Klicke hier um ein neues Ticket zu erstellen!
            </p>
            <router-link to="/create-ticket" class="button is-primary">
              <span class="icon is-small">
                <i class="fas fa-plus"></i>
              </span>
            </router-link>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="card">
          <div class="card-content">
            <p class="title">Deine Tickets</p>
            <p class="subtitle">
              Klicke hier um deine Tickets einzusehen und zu bearbeiten!
            </p>
            <router-link to="/tickets" class="button is-primary">
              <span class="icon is-small">
                <i class="far fa-edit"></i>
              </span>
            </router-link>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="card">
          <div class="card-content">
            <p class="title">Einstellungen</p>
            <p class="subtitle">
              Passwort ändern
            </p>
            <router-link class="button is-primary" to="/settings">
              <span class="icon is-small">
                <i class="fas fa-arrow-right"></i>
              </span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <p class="is-size-2">Datenbankrealtimeobjekt : {{ data.phrase1 }}</p>
  </div>
</template>

<script>
import auth from "../store/auth";
import firebase from "firebase";
import { ref } from "vue";
export default {
  setup() {
    const msg = "Hallo Welt";
    const data = ref("");
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
    return {
      email,
      data,
      msg,
    };
  },
};
</script>