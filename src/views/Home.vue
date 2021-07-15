<template>
  <div v-if="userData.deactivated" class="columns is-centered is-vcentered">
    <div
      class="
        column
        is-12-desktop is-two-thirds-widescreen is-half-fullhd is-12-mobile
      "
    >
      <div class="box has-text-centered">
        <h1 style="is-size-2">
          Dein Account wurde Grund missbräuchlichen Verhaltens deaktiviert.
        </h1>
        <div class="field mt-2">
          <p class="control">
            <a class="button is-danger is-fullwidth" @click="logout()"
              >Logout</a
            >
          </p>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="userData.appLoaded" class="home">
    <StudentView v-if="userData.role === 'student'" />
    <EditorView v-else-if="userData.role === 'editor'" />
    <AdminView v-else-if="userData.role === 'admin'" />
  </div>
  <div v-else class="columns is-centered is-vcentered">
    <div
      class="
        column
        is-12-desktop is-two-thirds-widescreen is-half-fullhd is-12-mobile
      "
    >
      <div class="box has-text-centered">
        <div class="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StudentView from "./student/StudentView";
import EditorView from "./editor/EditorView";
import AdminView from "./admin/AdminView";
import useFirebaseAuth, { getUserData } from "../store/firebase";
export default {
  components: {
    StudentView,
    EditorView,
    AdminView,
  },
  setup() {
    const userData = getUserData();
    const { logout } = useFirebaseAuth();
    return {
      userData,
      logout
    };
  },
};
</script>

<style lang="scss" scoped>
</style>