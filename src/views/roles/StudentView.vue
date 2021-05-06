<template>
  <div class="columns is-centered is-vcentered">
    <div
      class="column is-half-desktop is-one-third-widescreen is-one-quarter-fullhd"
    >
      <div class="box">
        <p class="title">Tickets</p>
        <p class="subtitle">Aktive Tickets: 0</p>
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
        <p class="title">Nutzer <span class="tag is-primary">Student</span></p>
        <p class="subtitle">{{ userData.email }} </p>
        <div class="buttons is-grouped is-centered">
          <!-- <router-link class="button is-primary" to="/settings">
            <span class="icon is-small">
              <i class="fas fa-arrow-right"></i>
            </span>
            <span>Passwort ändern</span>
          </router-link> -->
          <a class="button is-danger" @click="logout()">Logout</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useFirebaseAuth from "../../store/user";
export default {
  name: "StudentView",
  setup() {
    const state = useFirebaseAuth();
    const { logout } = useFirebaseAuth();
    const userData = state.userData.value;
    return {
      userData,
      logout
    };
  },
};
</script>