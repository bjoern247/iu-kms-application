<template>
  <div class="box">
    <p class="title">Kursverwaltung</p>
    <form @submit.prevent="onSubmit">
      <div class="columns">
        <div class="column is-8">
          <div class="field">
            <label class="label">Kursname</label>
            <div class="control">
              <input
                class="input"
                type="text"
                v-model="course.courseName"
                placeholder="Kursname"
              />
            </div>
          </div>
          <!-- <div class="field">
              <label class="label">Kursverantwortlicher</label>
              <div class="control">
                <div class="select">
                  <select>
                    <option>Auswählen</option>
                    <option>With options</option>
                  </select>
                </div>
              </div>
            </div> -->
        </div>
        <div class="column is-4">
          <div class="field">
            <label class="label">Kurskürzel</label>
            <div class="control has-icons-right">
              <input
                class="input"
                type="text"
                v-model="course.courseId"
                placeholder="Kürzel"
              />
              <span v-if="false" class="icon is-small is-right">
                <i class="fas fa-check"></i>
              </span>
              <span v-if="false" class="icon is-small is-right">
                <i class="fas fa-exclamation-triangle"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column is-12">
          <!-- <div class="field">
            <div class="control">
              <button
                class="button is-primary"
                :class="{ 'is-loading': loading }"
                type="submit"
              >
                Speichern
              </button>
            </div>
          </div> -->
          <div class="buttons">
            <button
              class="button is-primary"
              :class="{ 'is-loading': loading }"
              type="submit"
            >
              <span class="icon is-small">
                <i class="fas fa-save"></i>
              </span>
              <span>Speichern</span>
            </button>
            <button class="button is-dark" type="button">
              <span class="icon is-small">
                <i class="fas fa-comment-slash"></i>
              </span>
              <span>Deaktivieren</span>
            </button>
            <button class="button is-danger" type="button">
              <span class="icon is-small">
                <i class="fas fa-trash-alt"></i>
              </span>
              <span>Löschen</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { getCourse, updateCourse } from "../store/firebase";
import { ref } from "vue";
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const course = getCourse(router.currentRoute.value.params.id);
    // console.log(course[0].id);
    const loading = ref(false);
    const onSubmit = async () => {
      loading.value = true;
      await updateCourse(course.id, course.courseId, course.courseName).then(
        () => {
          loading.value = false;
          router.push("/course-overview");
        },
        () => {
          loading.value = false;
        }
      );
    };
    return {
      loading,
      onSubmit,
      course,
    };
  },
};
</script>