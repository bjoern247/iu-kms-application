<template>
  <div class="app-content">
    <router-view />
  </div>
</template>

<script>
import auth from "./store/auth";
import firebase from "firebase";
import { useRouter } from "vue-router";
export default {
  setup() {
    let { user, loading, error } = auth();
    console.log(user.value);
    const router = useRouter();
    function logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          router.push("/login");
        })
        .catch((error) => {
          console.log(error);
        });
    }
    return {
      user,
      loading,
      error,
      logout,
    };
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.navbar {
  box-shadow: 0 4px 5px 0px rgba(0, 0, 0, 0.1);
}
.navbar-item {
  font-weight: 700;
}
.app-content {
  margin-left: 1rem;
  margin-right: 1rem;
}
</style>
