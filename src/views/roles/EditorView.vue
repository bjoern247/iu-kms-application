<template>
  <div class="columns is-centered is-vcentered">
    <div
      class="column is-half-desktop is-one-third-widescreen is-one-quarter-fullhd"
    >
      <div class="box">
        <p class="title">Tickets</p>
        <p class="subtitle">Neu <span class="tag is-rounded is-danger">0</span> Offen <span class="tag is-rounded is-warning">0</span> Rückfrage <span class="tag is-rounded is-success">0</span></p>
        <div class="field is-horizontal">
          <div class="field-body">
            <div class="field">
              <p class="control">
                <router-link
                  to="/ticket-overview"
                  class="button is-primary is-fullwidth"
                >
                  <span class="icon is-small">
                    <i class="far fa-edit"></i>
                  </span>
                  <span>Zur Bearbeitung</span>
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="column is-half-desktop is-one-third-widescreen is-one-quarter-fullhd"
    >
      <div class="box">
        <p class="title">Konto</p>
        <p class="subtitle">
          {{ userData.displayName }}
          <span class="tag is-warning">Bearbeiter</span>
        </p>
        <div class="field is-horizontal">
          <div class="field-body">
            <div class="field">
              <p class="control">
                <router-link
                  class="button is-primary is-fullwidth"
                  to="/course-overview"
                >
                  <span class="icon is-small">
                    <i class="fas fa-arrow-right"></i>
                  </span>
                  <span>Kursübersicht</span>
                </router-link>
              </p>
            </div>
            <div class="field">
              <p class="control">
                <a class="button is-danger is-fullwidth" @click="logout()"
                  >Logout</a
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import useFirebaseAuth from "../../store/user";
export default {
  name: "EditorView",
  setup() {
    const state = useFirebaseAuth();
    const { logout } = useFirebaseAuth();
    const userData = state.userData.value;
    return {
      userData,
      logout,
    };
  },
};
</script>