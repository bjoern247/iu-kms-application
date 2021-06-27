<template>
  <div class="box" v-if="loaded">
    <p class="title">Ticketinformationen</p>
    <form>
      <div class="columns">
        <div class="column is-8">
          <fieldset disabled>
            <div class="field">
              <label class="label">Tickettitel</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  :value="ticket.ticketName"
                  placeholder="Error-732"
                />
              </div>
            </div>
            <div class="field">
              <label class="label">Ersteller</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  v-model="ticket.creatorMail"
                  placeholder="Error-732"
                />
              </div>
            </div>
            <div class="field">
              <label class="label">Erstellt am</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  :value="
                    ticket.datetime.toDate().toLocaleDateString('de-DE', {
                      day: 'numeric',
                      year: 'numeric',
                      month: '2-digit',
                      hour: 'numeric',
                      minute: 'numeric',
                    })
                  "
                  placeholder="Error-732"
                />
              </div>
            </div>
            <div class="field">
              <label class="label">Ticket-Text</label>
              <div class="control">
                <textarea
                  v-model="ticket.ticketText"
                  class="textarea"
                  type="text"
                  placeholder="Error-732"
                  rows="10"
                ></textarea>
              </div>
            </div>
          </fieldset>
        </div>
        <div class="column is-4">
          <fieldset disabled>
            <div class="field">
              <label class="label">Kurskürzel</label>
              <div class="control has-icons-right">
                <input
                  class="input"
                  type="text"
                  v-model="ticket.courseId"
                  placeholder="Kürzel"
                />
              </div>
            </div>
            <div class="field">
              <label class="label">Kategorie</label>
              <div class="control has-icons-right">
                <input
                  class="input"
                  type="text"
                  v-model="ticket.ticketCategory"
                  placeholder="Kürzel"
                />
              </div>
            </div>
            <div class="field">
              <label class="label">Ticket-ID</label>
              <div class="control has-icons-right">
                <input
                  class="input"
                  type="text"
                  v-model="ticket.ticketId"
                  placeholder="Kürzel"
                />
              </div>
            </div>
            <div class="field">
              <label class="label">Status</label>
              <div class="control has-icons-right">
                <span
                  v-if="ticket.ticketStatus === 'created'"
                  class="tag is-medium is-light"
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
            </div>
          </fieldset>
          <div class="field mt-2" v-if="userData.role === 'admin'">
            <label class="label">Administrator-Operationen</label>
            <div class="control">
              <legend>
                <button
                  class="button is-danger"
                  :class="{ 'is-loading': deleteOperationLoading }"
                  type="button"
                  @click="submitDelete()"
                >
                  <span class="icon is-small">
                    <i class="fas fa-trash-alt"></i>
                  </span>
                  <span>Löschen</span>
                </button>
              </legend>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
  <div class="box" v-else>
    <p class="title">Ticketinformationen</p>
    <div class="lds-hourglass"></div>
  </div>
</template>

<script>
import {
  getTicket,
  getUserData,
  loadTicket,
  deleteTicket,
  stopTicketListener,
} from "../store/firebase";
import { useRouter } from "vue-router";
import { onUnmounted } from "@vue/runtime-core";
import { ref } from "vue";
export default {
  setup() {
    const router = useRouter();
    const loaded = ref(false);
    const userData = getUserData();
    const deleteOperationLoading = ref(false);
    loadTicket(router.currentRoute.value.params.id).then(() => {
      loaded.value = true;
    });
    const ticket = getTicket();
    onUnmounted(() => {
      stopTicketListener();
    });
    const submitDelete = async () => {
      deleteOperationLoading.value = true;
      const result = confirm(
        "Das Löschen kann nicht rückgängig gemacht werden!"
      );
      if (result) {
        router.push("/ticket-overview");
        await deleteTicket(router.currentRoute.value.params.id)
          .then(
            () => {
              deleteOperationLoading.value = false;
            },
            (error) => {
              alert(error);
              deleteOperationLoading.value = false;
            }
          )
          .catch((error) => {
            console.log(error);
          });
      } else {
        deleteOperationLoading.value = false;
      }
    };
    return {
      ticket,
      loaded,
      userData,
      submitDelete,
    };
  },
};
</script>