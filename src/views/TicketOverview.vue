<template>
  <nav class="panel is-primary">
    <p v-if="userData.role === 'admin' || userData.role === 'student'" class="panel-heading">Ticketübersicht</p>
    <p v-else class="panel-heading">Ticket-Inbox</p>
    <div class="box p-0">
      <div
        class="columns is-mobile is-centered mt-2 mb-0 mr-0 ml-0"
        style="background-color: whitesmoke; border-bottom: 1px solid lightgrey"
      >
        <div
          class="
            column
            is-4-desktop is-3-tablet is-3-widescreen is-3-fullhd is-3-mobile
          "
        >
          Beschreibung
        </div>
        <div
          class="
            column
            is-2-desktop is-2-tablet is-2-widescreen is-2-fullhd is-2-mobile
          "
        >
          Kurs
        </div>
        <div
          class="
            column
            is-2-desktop is-2-tablet is-2-widescreen is-3-fullhd is-3-mobile
          "
        >
          Status
        </div>
        <div
          class="
            column
            is-2-desktop is-3-tablet is-3-widescreen is-2-fullhd is-2-mobile
          "
        >
          Datum
        </div>
        <div
          class="
            column
            is-2-desktop is-2-tablet is-2-widescreen is-2-fullhd is-2-mobile
            has-text-right
          "
        ></div>
      </div>

      <div v-for="ticket in tickets" :key="ticket.id" class="row">
        <div
          class="columns is-mobile is-centered is-vcentered mb-0 mt-0 mr-0 ml-0"
        >
          <div
            style="
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            "
            class="
              column
              is-4-desktop is-3-tablet is-3-widescreen is-3-fullhd is-3-mobile
            "
          >
            <span>{{ ticket.ticketName }}</span>
          </div>
          <div
            class="
              column
              is-2-desktop is-2-tablet is-2-widescreen is-2-fullhd is-2-mobile
            "
          >
            <span
              class="tag is-medium is-danger"
              v-if="ticket.courseId === 'Kurs existiert nicht'"
              >Kurs inexistent</span
            >
            <span class="tag is-medium is-primary" v-else>{{
              ticket.courseId
            }}</span>
          </div>
          <div
            class="
              column
              is-2-desktop is-2-tablet is-2-widescreen is-3-fullhd is-3-mobile
            "
          >
            <span
              v-if="ticket.ticketStatus === 'created'"
              class="tag is-medium is-dark"
              >In Prüfung</span
            >
            <span
              v-else-if="ticket.ticketStatus === 'validated'"
              class="tag is-medium is-warning"
              >In Bearbeitung</span
            >
            <span
              v-else-if="ticket.ticketStatus === 'closed'"
              class="tag is-medium is-success"
              >Abgeschlossen</span
            >
            <span
              v-else-if="ticket.ticketStatus === 'response'"
              class="tag is-medium is-danger"
              >Rückfrage</span
            >
            <span
              v-else-if="ticket.ticketStatus === 'awaiting deletion'"
              class="tag is-medium is-danger"
              >Löschung</span
            >
          </div>
          <div
            class="
              column
              is-2-desktop is-3-tablet is-3-widescreen is-2-fullhd is-2-mobile
            "
            style="
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            "
          >
            <span>
              {{
                ticket.datetime.toDate().toLocaleDateString("de-DE", {
                  day: "numeric",
                  year: "numeric",
                  month: "2-digit",
                  hour: "numeric",
                  minute: "numeric",
                })
              }}
            </span>
          </div>
          <div
            class="
              column
              is-2-desktop is-2-tablet is-2-widescreen is-2-fullhd is-2-mobile
            "
          >
            <div class="buttons is-right">
              <button
                class="button is-info is-pulled-right"
                @click="showTicket(ticket.id)"
              >
                <span class="icon">
                  <i class="far fa-eye"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr class="mb-0 mt-0" />
      <p class="panel-tabs">
        <a :class="{ 'is-active': showingAll }" @click="showAll()">Alle</a>
        <a :class="{ 'is-active': showingCreated }" @click="showInValidation()"
          >In Prüfung</a
        >
        <a :class="{ 'is-active': showingDeletion }" @click="showInDeletion()"
          >In Löschung</a
        >
        <a
          :class="{ 'is-active': showingValidated }"
          v-if="userData.role === 'student' || userData.role === 'admin'"
          @click="showValidated()"
          >In Bearbeitung</a
        >
        <a
          :class="{ 'is-active': showingClosed }"
          v-if="userData.role === 'student' || userData.role === 'admin'"
          @click="showClosed()"
          >Abgeschlossen</a
        >
      </p>
    </div>
  </nav>
</template>

<script>
import useFirebase, {
  getTickets,
  loadAllTickets,
  loadAllTicketsFilterClosed,
  loadAllTicketsFilterCreated,
  loadAllTicketsFilterDeletion,
  loadAllTicketsFilterValidated,
  loadCreatedTickets,
  loadCreatedTicketsFilterClosed,
  loadCreatedTicketsFilterCreated,
  loadCreatedTicketsFilterDeletion,
  loadCreatedTicketsFilterValidated,
  loadUnassignedTickets,
  loadUnassignedTicketsFilterCreated,
  loadUnassignedTicketsFilterLöschung,
} from "../store/firebase";
import { useRouter } from "vue-router";
import { ref } from "vue";
export default {
  setup() {
    const tickets = getTickets();
    const router = useRouter();
    const state = useFirebase();
    const userData = state.userData.value;
    const showingAll = ref(true);
    const showingClosed = ref(false);
    const showingValidated = ref(false);
    const showingDeletion = ref(false);
    const showingCreated = ref(false);
    function showTicket(id) {
      router.push("/ticket-detail-view/" + id);
    }
    const showInDeletion = () => {
      showingAll.value = false;
      showingCreated.value = false;
      showingDeletion.value = true;
      showingValidated.value = false;
      showingClosed.value = false;
      if (userData.role === "editor") {
        loadUnassignedTicketsFilterLöschung();
      } else if (userData.role === "student") {
        loadCreatedTicketsFilterDeletion();
      } else if (userData.role === 'admin') {
        loadAllTicketsFilterDeletion();
      } 
    };
    const showInValidation = () => {
      showingAll.value = false;
      showingCreated.value = true;
      showingDeletion.value = false;
      showingValidated.value = false;
      showingClosed.value = false;
      if (userData.role === "editor") {
        loadUnassignedTicketsFilterCreated();
      } else if (userData.role === "student") {
        loadCreatedTicketsFilterCreated();
      } else if (userData.role === 'admin') {
        loadAllTicketsFilterCreated();
      } 
    };
    const showValidated = () => {
      showingAll.value = false;
      showingCreated.value = false;
      showingDeletion.value = false;
      showingValidated.value = true;
      showingClosed.value = false;
      if (userData.role === "student") {
        loadCreatedTicketsFilterValidated();
      } else if (userData.role === 'admin') {
        loadAllTicketsFilterValidated();
      }
    };
    const showClosed = () => {
      showingAll.value = false;
      showingCreated.value = false;
      showingDeletion.value = false;
      showingValidated.value = false;
      showingClosed.value = true;
      if (userData.role === "student") {
        loadCreatedTicketsFilterClosed();
      } else if (userData.role === 'admin') {
        loadAllTicketsFilterClosed();
      }
    };
    const showAll = () => {
      showingAll.value = true;
      showingCreated.value = false;
      showingDeletion.value = false;
      showingValidated.value = false;
      showingClosed.value = false;
      if (userData.role === "editor") {
        loadUnassignedTickets();
      } else if (userData.role === "student") {
        loadCreatedTickets();
      } else if (userData.role === 'admin') {
        loadAllTickets();
      }
    };
    return {
      tickets,
      userData,
      showTicket,
      showInDeletion,
      showingAll,
      showingDeletion,
      showingValidated,
      showAll,
      showInValidation,
      showingCreated,
      showingClosed,
      showClosed,
      showValidated,
    };
  },
};
</script>

<style lang="scss" scoped>
.row:nth-child(odd) {
  background-color: whitesmoke;
}
.row:nth-child(even) {
  background-color: white;
}
.tag-button:hover {
  background-color: #00c4a7;
  border-color: transparent;
  color: #fff;
  cursor: pointer;
}
.box {
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}
.panel-tabs {
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}
</style>