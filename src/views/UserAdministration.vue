<template>
  <div class="box">
    <p class="title">Benutzerverwaltung</p>
    <form>
      <div class="columns">
        <div class="column is-7">
          <fieldset disabled>
            <div class="field">
              <label class="label">Name</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  v-model="user.displayName"
                  placeholder="Kursname"
                />
              </div>
            </div>
            <div class="field">
              <label class="label">E-Mail</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  v-model="user.email"
                  placeholder="Kursname"
                />
              </div>
            </div>
          </fieldset>
        </div>
        <div class="column is-5">
          <div class="field">
            <label class="label">Rolle</label>
            <div class="control has-icons-right">
              <div class="select">
                <select v-model="user.role">
                  <option>{{ user.role }}</option>
                  <option>editor</option>
                  <option>admin</option>
                </select>
              </div>
            </div>
          </div>
          <fieldset disabled>
            <div class="field">
              <label class="label">UID</label>
              <div class="control has-icons-right">
                <input
                  class="input"
                  type="text"
                  v-model="user.uid"
                  placeholder="Kürzel"
                />
              </div>
            </div>
          </fieldset>
        </div>
      </div>
      <div class="columns">
        <div class="column is-12">
          <div class="buttons">
            <button
              class="button is-primary"
              :class="{ 'is-loading': saveOperationLoading }"
              type="submit"
            >
              <span class="icon is-small">
                <i class="fas fa-save"></i>
              </span>
              <span>Speichern</span>
            </button>
            <button
              class="button is-dark"
              type="button"
              @click="submitDeactivation()"
            >
              <span class="icon is-small">
                <i class="fas fa-ban"></i>
              </span>
              <span>Deaktivieren</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { getUser, updateUser } from "../store/firebase";
import { useRouter } from "vue-router";
import { ref } from 'vue';
export default {
  setup() {
    const router = useRouter();
    const saveOperationLoading = ref(false);
    const user = getUser(router.currentRoute.value.params.id);
    console.log(user);
    const submitSave = async () => {
      saveOperationLoading.value = true;
      await updateUser(user.id, user.role).then(
        () => {
          saveOperationLoading.value = false;
          router.push("/course-overview");
        },
        () => {
          saveOperationLoading.value = false;
        }
      );
    };
    const submitDeactivation = async () => {
      alert("Diese Funktion ist noch nicht implementiert!");
    };
    return {
      user,
      submitDeactivation,
      submitSave,
      saveOperationLoading
    };
  },
};
</script>