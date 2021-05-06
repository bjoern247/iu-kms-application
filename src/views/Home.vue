<template>
  <div class="home">
    <StudentView v-if="userData.role === 'student'" />
    <EditorView v-else-if="userData.role === 'editor'" />
    <AdminView v-else-if="userData.role === 'admin'" />
  </div>
</template>

<script>
import useFirebaseAuth from "../store/user";
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
    const state = useFirebaseAuth();
    const userData = state.userData.value;
    return {
      userData
    };
  },
};
</script>

<style lang="scss" scoped>
</style>