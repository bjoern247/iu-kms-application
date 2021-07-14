<template>
  <div class="box">
    <p class="title">Kursverwaltung</p>
    <form @submit.prevent="submitSave">
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
          <div class="field">
            <label class="label">Kurs Zuweisung:</label>
            <div class="control">
              <p v-if="course.editors.length === 0" class="has-text-danger">
                Keinem Bearbeiter zugewiesen!
              </p>
              <p v-else>
                <span v-for="(user, index) in assignedEditors" :key="index">
                  {{ nameWithComma(user.displayName, index) }}
                </span>
              </p>
            </div>
          </div>
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
          <div class="field">
            <label class="label">Zuweisung ändern</label>
            <div class="control">
              <button
                class="button is-info is-small is-rounded"
                type="button"
                @click="changeCourseEditors(course.id)"
              >
                <span class="icon is-small">
                  <i class="fas fa-user-edit"></i>
                </span>
                <span>Ändern</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column is-12">
          <div class="buttons">
            <button
              class="button is-primary"
              :class="{ 'is-loading': saveOperationLoading }"
              type="submit"
            >
              <span class="icon is-small">
                <i class="fas fa-save"></i>
              </span>
              <span>Speichern</span>
            </button>
            <button
              class="button is-dark"
              type="button"
              @click="submitDeactivation()"
            >
              <span class="icon is-small">
                <i class="fas fa-comment-slash"></i>
              </span>
              <span>Deaktivieren</span>
            </button>
            <button
              class="button is-danger"
              :class="{ 'is-loading': deleteOperationLoading }"
              type="button"
              @click="submitDelete()"
            >
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
import {
  getCourse,
  updateCourse,
  deleteCourse,
  getAssignedEditors,
  startCourseListeners
} from "../../store/firebase";
import { ref } from "vue";
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const course = getCourse(router.currentRoute.value.params.id);
    startCourseListeners(course.courseId);
    const assignedEditors = getAssignedEditors();
    console.log(course);
    const saveOperationLoading = ref(false);
    const deleteOperationLoading = ref(false);
    const submitSave = async () => {
      saveOperationLoading.value = true;
      await updateCourse(course.id, course.courseId, course.courseName).then(
        () => {
          saveOperationLoading.value = false;
          router.push("/course-overview");
        },
        () => {
          saveOperationLoading.value = false;
        }
      );
    };
    const submitDelete = async () => {
      deleteOperationLoading.value = true;
      const result = confirm(
        "Das Löschen kann nicht rückgängig gemacht werden!"
      );
      if (result) {
        await deleteCourse(course.id).then(
          () => {
            deleteOperationLoading.value = false;
            router.push("/course-overview");
          },
          () => {
            deleteOperationLoading.value = false;
          }
        );
      } else {
        deleteOperationLoading.value = false;
      }
    };
    const submitDeactivation = async () => {
      alert("Diese Funktion ist noch nicht implementiert!");
    };
    const changeCourseEditors = (id) => {
      router.push("/course-editors/" + id);
    };
    const nameWithComma = (name, index) => {

      if (index !== assignedEditors.value.length - 1) {
        return name + "," + " ";
      } else {
        return name;
      }
    };
    return {
      deleteOperationLoading,
      saveOperationLoading,
      submitSave,
      course,
      submitDelete,
      submitDeactivation,
      changeCourseEditors,
      assignedEditors,
      nameWithComma
    };
  },
};
</script>