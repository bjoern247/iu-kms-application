<template>
  <form class="box" @submit.prevent="Login">
    <p class="is-size-3 mb-4 has-text-centered">Anmeldung</p>
    <div class="field">
      <p class="control has-icons-left">
        <input class="input" type="email" placeholder="Email" v-model="email" />
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>
      </p>
    </div>
    <div class="field">
      <p class="control has-icons-left">
        <input
          class="input"
          :type="passwordFieldType"
          placeholder="Password"
          v-model="password"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-lock"></i>
        </span>
      </p>
    </div>
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <label class="checkbox">
            <input type="checkbox" @click="switchVisibility()" />
            Passwort anzeigen
          </label>
        </div>
      </div>
    </nav>

    <p class="control">
      <button
        class="button is-primary"
        style="width: 100%"
        :class="{ 'is-loading': loading }"
        @click="login()"
      >
        Login
      </button>
    </p>
  </form>
</template>

<script>
import { ref } from "vue";
import firebase from "firebase";
import { useRouter } from "vue-router";

export default {
  setup() {
    const email = ref("");
    const passwordFieldType = ref("password");
    const password = ref("");
    const router = useRouter();
    const loading = ref(false);

    function login() {
      loading.value = true;
      firebase
        .auth()
        .signInWithEmailAndPassword(email.value, password.value)
        .then(() => {
          router.push("/");
          loading.value = false;
        })
        .catch((err) => {
          if (err.code == 'auth/invalid-email') {
            alert('Die E-Mail Adresse ist falsch formatiert, bitte überprüfe die eingegeben E-Mail-Adresse!');
          } else if (err.code == 'auth/wrong-password') {
            alert('Diese E-Mail / Password Kombination ist uns nicht bekannt. Bitte überprüfe beide Felder oder lasse dir einen Account erstellen!');
          } else {
            alert('Beim Einloggen ist ein Fehler aufgetreten. Fehler: '+err.code+'! Bitte wende dich an den Support!');
          }
          loading.value = false;
        });
    }
    function switchVisibility() {
      passwordFieldType.value =
        this.passwordFieldType === "password" ? "text" : "password";
    }

    return {
      email,
      passwordFieldType,
      password,
      login,
      loading,
      switchVisibility,
    };
  },
};
</script>

<style lang="scss" scoped>
.login {
  height: 90vh;
  padding: 0;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  max-height: 90vh;
}
</style>