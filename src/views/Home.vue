<template>
  <div v-if="userData.appLoaded" class="home">
    <StudentView v-if="userData.role === 'student'" />
    <EditorView v-else-if="userData.role === 'editor'" />
    <AdminView v-else-if="userData.role === 'admin'" />
  </div>
  <div v-else class="columns is-centered is-vcentered">
    <div class="column is-12-desktop is-two-thirds-widescreen is-half-fullhd is-12-mobile">
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
import { getUserData } from "../store/firebase";
export default {
  components: {
    StudentView,
    EditorView,
    AdminView,
  },
  setup() {
    const userData = getUserData();
    return {
      userData,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>