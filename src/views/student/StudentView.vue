<template>
  <div class="columns is-centered is-vcentered">
    <div
      class="column is-half-desktop is-one-third-widescreen is-one-quarter-fullhd"
    >
      <div class="box">
        <p class="title">Tickets</p>
        <p class="subtitle">In Prüfung <span class="tag is-rounded is-warning">{{ticketData.created}}</span> In Bearbeitung <span class="tag is-rounded is-success">{{ticketData.validated}}</span> </p>
        <div class="field is-horizontal">
          <div class="field-body">
            <div class="field">
              <p class="control">
                <router-link
                  to="/create-ticket"
                  class="button is-primary is-fullwidth"
                >
                  <span class="icon is-small">
                    <i class="fa fa-plus"></i>
                  </span>
                  <span>Erstellen</span>
                </router-link>
              </p>
            </div>
            <div class="field">
              <p class="control">
                <router-link
                  to="/ticket-overview"
                  class="button is-primary is-fullwidth"
                >
                  <span class="icon is-small">
                    <i class="far fa-edit"></i>
                  </span>
                  <span>Verwalten</span>
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
          <span class="tag is-info">Student</span>
        </p>
        <div class="field is-horizontal">
          <div class="field-body">
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
import useFirebaseAuth, { getTickets, getUserData, getStudentTicketState } from "../../store/firebase";
export default {
  name: "StudentView",
  setup() {
    const { logout } = useFirebaseAuth();
    const tickets = getTickets();
    const userData = getUserData();
    const ticketData = getStudentTicketState();
    return {
      userData,
      logout,
      tickets,
      ticketData
    };
  },
};
</script>