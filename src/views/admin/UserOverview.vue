<template>
  <nav class="panel is-primary">
    <p class="panel-heading">Nutzerübersicht</p>
    <div class="box p-0">
      <div
        class="columns is-mobile is-centered mt-2 mb-0 mr-0 ml-0"
        style="background-color: whitesmoke; border-bottom: 1px solid lightgrey"
      >
        <div
          class="
            column
            is-4-desktop is-4-tablet is-4-widescreen is-3-fullhd is-5-mobile
          "
        >
          Name
        </div>
        <div
          class="
            column
            is-3-desktop is-3-tablet is-3-widescreen is-4-fullhd is-2-mobile
          "
        >
          E-Mail
        </div>
        <div
          class="
            column
            is-2-desktop is-2-tablet is-2-widescreen is-3-fullhd is-2-mobile
          "
        >
          Nutzerrolle
        </div>
        <div
          class="
            column
            is-2-desktop is-2-tablet is-2-widescreen is-2-fullhd is-3-mobile
            has-text-right
          "
        ></div>
      </div>

      <div v-for="user in users" :key="user.uid" class="row">
        <div
          class="columns is-mobile is-centered is-vcentered mb-0 mt-0 mr-0 ml-0"
        >
          <div
            class="
              column
              is-4-desktop is-4-tablet is-4-widescreen is-3-fullhd is-5-mobile
            "
            style="
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            "
          >
            <span>{{ user.displayName }} </span>
          </div>
          <div
            style="
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            "
            class="
              column
              is-3-desktop is-3-tablet is-3-widescreen is-4-fullhd is-2-mobile
            "
          >
            <span>{{ user.email }}</span>
          </div>
          <div
            class="
              column
              is-2-desktop is-2-tablet is-2-widescreen is-3-fullhd is-3-mobile
            "
          >
            <span v-if="user.role === 'student'" class="tag is-medium is-info">
              Student
            </span>
            <span
              v-else-if="user.role === 'editor'"
              class="tag is-medium is-warning"
            >
              Bearbeiter
            </span>
            <span
              v-else-if="user.role === 'admin'"
              class="tag is-medium is-danger"
            >
              Admin
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
                class="button is-primary is-pulled-right"
                @click="editUser(user.uid)"
              >
                <span class="icon">
                  <i class="fas fa-edit"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr class="mb-0 mt-0" />
      <p class="panel-tabs">
        <a :class="{ 'is-active': showingAll }" @click="showAll()">Alle</a>
        <a :class="{ 'is-active': showingStudents }" @click="showStudents()">Studenten</a>
        <a :class="{ 'is-active': showingEditors }" @click="showEditors()">Ticketbearbeiter</a>
        <a :class="{ 'is-active': showingAdmins }" @click="showAdmins()">Administratoren</a>
      </p>
    </div>
  </nav>
</template>

<script>
import { getUsers, loadUsers, loadUsersFilterAdmins, loadUsersFilterEditors, loadUsersFilterStudents } from "../../store/firebase";
import { useRouter } from "vue-router";
import { ref } from 'vue';
export default {
  setup() {
    const router = useRouter();
    const users = getUsers();
    const showingAll = ref(true);
    const showingStudents = ref(false);
    const showingEditors = ref(false);
    const showingAdmins = ref(false);
    function editUser(id) {
      router.push("/user-detail-view/" + id);
    }
    const showAll = () => {
      showingAll.value = true;
      showingStudents.value = false;
      showingEditors.value = false;
      showingAdmins.value = false;
      loadUsers();
    }
    const showStudents = () => {
      showingAll.value = false;
      showingStudents.value = true;
      showingEditors.value = false;
      showingAdmins.value = false;
      loadUsersFilterStudents();
    }
    const showEditors = () => {
      showingAll.value = false;
      showingStudents.value = false;
      showingEditors.value = true;
      showingAdmins.value = false;
      loadUsersFilterEditors();
    }
    const showAdmins = () => {
      showingAll.value = false;
      showingStudents.value = false;
      showingEditors.value = false;
      showingAdmins.value = true;
      loadUsersFilterAdmins();
    }
    return {
      editUser,
      users,
      showingAll,
      showingAdmins,
      showingEditors,
      showingStudents,
      showAll,
      showStudents,
      showEditors,
      showAdmins
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