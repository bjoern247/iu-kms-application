<template>
  <section class="hero is-light is-fullheight-with-navbar">
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
          <div class="columns">
            <div class="column">
              <div class="field is-grouped is-left">
                <p class="control">
                  <button class="button is-primary" @click="login()">
                    Login
                  </button>
                </p>
              </div>
            </div>
            <div class="column">
              <div class="field is-grouped is-right">
                <p class="control">
                  <button class="button" @click="resetPassword()">
                    Passwort vergessen
                  </button>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
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

    function login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(email.value, password.value)
        .then(() => {
          (data) => console.log(data);
          router.push("/");
        })
        .catch((err) => alert(err.message));
    }

    function resetPassword() {
      // To-DO
    }

    return {
      email,
      password,
      login,
      resetPassword,
    };
  },
};
</script>