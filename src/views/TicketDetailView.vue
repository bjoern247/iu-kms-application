<template>
  <div class="box" v-if="loaded">
    <p class="title">Ticketinformationen</p>
    <p
      class="subtitle"
      v-if="userData.role === 'editor' && ticket.ticketStatus === 'created'"
    >
      Zum Abschluss der Prüfung und zur Bearbeitung bitte Ticket zuweisen!
    </p>
    <p
      class="subtitle"
      v-if="userData.role === 'student' && ticket.ticketStatus === 'created'"
    >
      Das Ticket wird zur Zeit geprüft. Die Bearbeitung erfolgt anschließend
    </p>
    <p
      class="subtitle"
      v-if="
        userData.role === 'student' &&
        ticket.ticketStatus === 'awaiting deletion'
      "
    >
      Das Ticket wurde zur Löschung vorgemerkt und wird bald gelöscht. Wenn dies
      nicht richtig ist erstelle ein neues Ticket mit genaueren Informationen
      oder melde dich bei deinem Tutor.
    </p>
    <p
      class="subtitle"
      v-if="userData.role === 'editor' && ticket.ticketStatus === 'awaiting deletion'"
    >
      Das Ticket wurde zur Löschung durch einen Administrator vorgemerkt.
    </p>
    <p
      class="subtitle"
      v-if="userData.role === 'admin' && ticket.ticketStatus === 'awaiting deletion'"
    >
      Das Ticket wurde von einem Bearbeiter zur Löschung markiert. Löschung oder Reaktivierung möglich.
    </p>
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
          <div class="field" v-if="userData.role === 'admin'">
            <label class="label">Admin-Ticket-Log</label>
            <div class="control">
              <fieldset disabled>
                <div v-for="element in ticket.ticketLog" :key="element">
                  <textarea
                    :value="element"
                    class="textarea"
                    type="text"
                    placeholder="Error-732"
                  ></textarea>
                </div>
              </fieldset>
            </div>
          </div>
          <div class="field mt-2" v-if="userData.role === 'admin'">
            <label class="label">Administrator-Operationen</label>
            <div class="control buttons mt-2">
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
              <button v-if="ticket.ticketStatus === 'awaiting deletion'"
                class="button is-warning"
                :class="{ 'is-loading': validationOperationLoading }"
                type="button"
                @click="submitReactivation()"
              >
                <span class="icon is-small">
                  <i class="fas fa-undo"></i>
                </span>
                <span>Reaktivieren</span>
              </button>
            </div>
          </div>
          <!-- Editor -->
          <div
            class="field mt-2"
            v-if="
              userData.role === 'editor' && ticket.ticketStatus === 'created'
            "
          >
            <label class="label">Prüfungs-Optionen</label>
            <div class="control buttons">
              <button
                class="button is-success"
                :class="{ 'is-loading': deleteOperationLoading }"
                type="button"
                @click="submitValidation()"
              >
                <span class="icon is-small">
                  <i class="fas fa-clipboard-check"></i>
                </span>
                <span>Mir zuweisen</span>
              </button>
              <button
                class="button is-danger"
                :class="{ 'is-loading': validationOperationLoading }"
                type="button"
                @click="flagForDeletion()"
              >
                <span class="icon is-small">
                  <i class="fas fa-flag"></i>
                </span>
                <span>Löschung beantragen</span>
              </button>
            </div>
          </div>
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
                  class="tag is-medium is-dark"
                  >Abgeschlossen</span
                >
                <span
                  v-else-if="ticket.ticketStatus === 'awaiting deletion'"
                  class="tag is-medium is-danger"
                  >Löschung im Gange</span
                >
              </div>
            </div>
          </fieldset>
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
  validateTicket,
  reactivateTicket,
  flagTicketForDeletion,
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
    console.log(userData);
    const deleteOperationLoading = ref(false);
    const validationOperationLoading = ref(false);
    const ticketId = router.currentRoute.value.params.id;
    loadTicket(ticketId).then(() => {
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
        await deleteTicket(ticketId)
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
    const submitValidation = async () => {
      validationOperationLoading.value = true;
      await validateTicket(ticketId)
        .then(
          () => {
            validationOperationLoading.value = false;
          },
          (error) => {
            alert(error);
            validationOperationLoading.value = false;
          }
        )
        .catch((error) => {
          console.log(error);
        });
    };
    const submitReactivation = async () => {
      validationOperationLoading.value = true;
      const result = confirm(
        "Das Ticket wird reaktiviert und landet wieder bei den Bearbeitern in der Inbox!"
      );
      if (result) {
      await reactivateTicket(ticketId)
        .then(
          () => {
            validationOperationLoading.value = false;
          },
          (error) => {
            alert(error);
            validationOperationLoading.value = false;
          }
        )
        .catch((error) => {
          console.log(error);
        });
      }
    };
    const flagForDeletion = async () => {
      deleteOperationLoading.value = true;
      const result = confirm(
        "Die Beantragung zur Löschung kann nicht rückgängig gemacht werden!"
      );
      if (result) {
        await flagTicketForDeletion(ticketId)
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
      submitValidation,
      flagForDeletion,
      submitReactivation
    };
  },
};
</script>