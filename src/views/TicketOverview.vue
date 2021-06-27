<template>
  <nav class="panel is-primary">
    <p class="panel-heading">Ticketübersicht</p>
    <div class="panel-block">
      <p class="control has-icons-left">
        <input class="input" type="text" placeholder="Search" />
        <span class="icon is-left">
          <i class="fas fa-search" aria-hidden="true"></i>
        </span>
      </p>
    </div>
    <div class="box p-0">
      <div
        class="columns is-mobile is-centered mt-2 mb-0 mr-0 ml-0"
        style="background-color: whitesmoke; border-bottom: 1px solid lightgrey"
      >
        <div
          class="
            column
            is-4-desktop is-3-tablet is-3-widescreen is-4-fullhd is-3-mobile
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
            is-2-desktop is-2-tablet is-2-widescreen is-2-fullhd is-3-mobile
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
          Datum & Zeit
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
              is-4-desktop is-3-tablet is-3-widescreen is-4-fullhd is-3-mobile
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
            <span class="tag is-medium is-dark">{{ ticket.courseId }} </span>
          </div>
          <div
          class="
            column
            is-2-desktop is-2-tablet is-2-widescreen is-2-fullhd is-3-mobile
          "
        >
          <span
                  v-if="ticket.ticketStatus === 'created'"
                  class="tag is-medium is-dark"
                  >In Prüfung</span
                >
                <span
                  v-else-if="ticket.ticketStatus === 'validated'"
                  class="tag is-medium is-success"
                  >In Bearbeitung</span
                >
                <span
                  v-else-if="ticket.ticketStatus === 'closed'"
                  class="tag is-medium is-danger"
                  >Abgeschlossen</span
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
              {{ ticket.datetime.toDate().toLocaleDateString("de-DE", {day: "numeric", year: "numeric", month: "2-digit", hour: "numeric", minute: "numeric"}) }}
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
        <hr class="m-0">
      </div>
      <hr class="mb-0" />
    </div>
  </nav>
</template>

<script>
import useFirebase, { getTickets } from "../store/firebase";
import { useRouter } from "vue-router";
export default {
  setup() {
    const tickets = getTickets();
    const router = useRouter();
    const state = useFirebase();
    const userData = state.userData.value;
    function showTicket(id) {
      router.push('/ticket-detail-view/' + id);
    }
    return {
      tickets,
      userData,
      showTicket
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