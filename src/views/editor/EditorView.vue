<template>
  <div class="columns is-centered is-vcentered">
    <div
      class="column is-half-desktop is-one-third-widescreen is-one-quarter-fullhd"
    >
      <div class="box">
        <p class="title">Tickets</p>
        <p class="subtitle">Neu <span class="tag is-rounded is-danger">{{ticketData.created}}</span> In Bearbeitung <span class="tag is-rounded is-warning">{{ticketData.validated}}</span></p>
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
                  to="/my-courses"
                >
                  <span class="icon is-small">
                    <i class="fas fa-arrow-right"></i>
                  </span>
                  <span>Meine Kurse</span>
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
import useFirebaseAuth, { getEditorTicketState, getUserData } from "../../store/firebase";
export default {
  name: "EditorView",
  setup() {
    const { logout } = useFirebaseAuth();
    const userData = getUserData();
    const ticketData = getEditorTicketState();
    return {
      userData,
      logout,
      ticketData
    };
  },
};
</script>