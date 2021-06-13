<template>
<div class="box">
    <p class="title">Ticketdetails</p>
    <p class="subtitle">Noch nicht implementiert</p>
</div>
</template>

<script>
import useFirebase from "../store/firebase";
export default {
  setup() {
    const state = useFirebase();
    const userData = state.userData.value;
    return {
      userData,
    };
  },
};
</script>
