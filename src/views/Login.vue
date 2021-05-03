<template>
  <div class="container">
    <div class="login">
      <h1 class="is-size-1">Bitte anmelden</h1>
      <form @submit.prevent="Login">
        <div class="field">
          <p class="control has-icons-left">
            <input
              class="input"
              type="email"
              placeholder="Email"
              v-model="email"
            />
            <span class="icon is-small is-left">
              <i class="fas fa-envelope"></i>
            </span>
          </p>
        </div>
        <div class="field">
          <p class="control has-icons-left">
            <input
              class="input"
              type="password"
              placeholder="Password"
              v-model="password"
            />
            <span class="icon is-small is-left">
              <i class="fas fa-lock"></i>
            </span>
          </p>
        </div>
        <div class="buttons">
          <p class="control" style="width: 50%">
            <button style="width: 100%"
              class="button is-primary"
              :class="{ 'is-loading': loading }"
              @click="login()"
            >
              Login
            </button>
          </p>
          <p class="control is-right" style="width: 48%; margin-left: 2%;">
            <button class="button" @click="resetPassword()" style="width: 100%;">
              Passwort vergessen
            </button>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import firebase from "firebase";
import { useRouter } from "vue-router";

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const router = useRouter();
    const loading = ref(false);

    function login() {
      loading.value = true;
      firebase
        .auth()
        .signInWithEmailAndPassword(email.value, password.value)
        .then(() => {
          (data) => console.log(data);
          router.push("/");
          loading.value = false;
        })
        .catch((err) => {
          alert(err.message);
          loading.value = false;
        });
    }

    function resetPassword() {
      // To-DO
    }

    return {
      email,
      password,
      login,
      resetPassword,
      loading,
    };
  },
};
</script>

<style lang="scss" scoped>
.login {
  margin-left: 15vw;
  margin-right: 15vw;
}
</style>