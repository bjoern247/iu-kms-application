<template>
  <div class="home">
    <StudentView v-if="user.type === 'student'" />
    <EmployeeView v-else-if="user.type === 'employee'" />
    <AdminView v-else-if="user.type === 'admin'" />
  </div>
</template>

<script>
import StudentView from "./roles/StudentView";
import EmployeeView from "./roles/EmployeeView";
import AdminView from "./roles/AdminView";
import { reactive } from "vue";
export default {
  components: {
    StudentView,
    EmployeeView,
    AdminView,
  },
  setup() {
    const user = reactive({
      type: "student",
    });
    console.log(user.type);
    return {
      user,
    };
  },
};
</script>

<style lang="scss" scoped>
.home {
  padding: 4rem;
}
</style>