<template>
  <div class="box">
    <p class="title">Ticketerstellung</p>
    <form @submit.prevent="onSubmit">
      <div class="columns">
        <div class="column is-8">
          <div class="field">
            <label class="label">Ticketbeschreibung</label>
            <div class="control" :class="{ 'is-loading': loading }">
              <input
                class="input"
                type="text"
                v-model="form.ticketName"
                placeholder="Kurzbeschreibung"
              />
            </div>
          </div>
          <div class="field">
            <label class="label">Detaillierte Fehlerbeschreibung</label>
            <div class="control" :class="{ 'is-loading': loading }">
              <textarea
                v-model="form.ticketText"
                class="textarea"
                placeholder="..."
                rows="10"
              ></textarea>
            </div>
          </div>
        </div>
        <div class="column is-4">
          <div class="field">
            <label class="label">Kurs</label>
            <div class="control">
              <div class="select">
                <select v-model="form.course">
                  <option v-for="course in courses" :key="course.courseId">
                    {{ course.courseId }}
                  </option>
                  <option>Kurs existiert nicht</option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">Material</label>
            <div class="control">
              <div class="select">
                <select v-model="form.ticketCategory">
                  <option>Skript</option>
                  <option>MyCampus Wissenskontrolle</option>
                  <option>Probeklausur</option>
                  <option>Literaturliste</option>
                  <option>Kursvideo</option>
                  <option>Sonstiges</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column is-12">
          <div class="field">
            <div class="control">
              <button
                class="button is-primary"
                :class="{ 'is-loading': loading }"
                type="submit"
                :disabled="(form.ticketName.length < 3) || (form.ticketText.length < 7)"
              >
                <span class="icon is-small">
                  <i class="fas fa-save"></i>
                </span>
                <span>Speichern</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { createTicket, getCourses } from "../../store/firebase";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const courses = getCourses();
    const form = reactive({
      ticketName: "",
      ticketText: "",
      ticketCategory: "Skript",
      course: courses.value[0].courseId,
    });
    const onSubmit = async () => {
      loading.value = true;
      await createTicket(
        form.ticketName,
        form.ticketText,
        form.ticketCategory,
        form.course
      ).then(
        () => {
          form.ticketName = "";
          form.ticketText = "";
          form.ticketCategory = "Skript";
          loading.value = false;
          router.push("/ticket-overview");
        },
        () => {
          loading.value = false;
        }
      );
    };

    return {
      form,
      loading,
      onSubmit,
      courses,
    };
  },
};
</script>