<template>
  <div class="box">
    <p class="title">Kursinformationen</p>
    <fieldset disabled>
    <form>
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
        </div>
      </div>
    </form>
    </fieldset>
  </div>
</template>

<script>
import { getCourse } from "../store/firebase";
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const course = getCourse(router.currentRoute.value.params.id);
    return {
      course
    };
  },
};
</script>