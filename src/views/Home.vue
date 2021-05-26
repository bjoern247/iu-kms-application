<template>
  <div class="home">
    <StudentView v-if="userData.role === 'student'" />
    <EditorView v-else-if="userData.role === 'editor'" />
    <AdminView v-else-if="userData.role === 'admin'" />
  </div>
</template>

<script>
import useFirebase from "../store/firebase";
import StudentView from "./roles/StudentView";
import EditorView from "./roles/EditorView";
import AdminView from "./roles/AdminView";
export default {
  components: {
    StudentView,
    EditorView,
    AdminView,
  },
  setup() {
    const state = useFirebase();
    const userData = state.userData.value;
    return {
      userData
    };
  },
};
</script>

<style lang="scss" scoped>
</style>