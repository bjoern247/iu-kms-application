<template>
  <nav class="panel is-primary">
    <p class="panel-heading">Kursübersicht</p>
    <div class="panel-block">
      <p class="control has-icons-left">
        <input class="input" type="text" placeholder="Search" />
        <span class="icon is-left">
          <i class="fas fa-search" aria-hidden="true"></i>
        </span>
      </p>
    </div>
    <div class="box p-0 pb-">
      <div v-for="course in courses" :key="course.id" class="row">
        <div class="columns is-mobile is-centered is-vcentered mt-2 pr-4 pl-4">
          <div
            class="column is-2-desktop is-2-tablet is-2-widescreen is-2-fullhd is-one-quarter-mobile"
          >
            <span class="tag is-dark is-medium">{{ course.courseId }}</span>
          </div>
          <div
            class="column is-8-desktop is-8-tablet is-8-widescreen is-8-fullhd is-half-mobile"
            style="
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            "
          >
            <span v-if="course.editors.length != 0" class="icon">
              <i class="fas fa-user-check"></i>
            </span>
            <span v-else class="icon">
              <i class="fas fa-user-times"></i>
            </span>
            <span class="ml-1">{{ course.courseName }}</span>
          </div>
          <div
            class="column is-2-desktop is-2-tablet is-2-widescreen is-2-fullhd is-one-quarter-mobile"
          >
            <div v-if="userData.role === 'admin'" class="buttons is-right">
              <button
                class="button is-primary is-pulled-right"
                @click="editCourse(course.id)"
              >
                <span class="icon">
                  <i class="fas fa-edit"></i>
                </span>
              </button>
            </div>
            <div v-else class="buttons is-right">
              <button
                class="button is-info is-pulled-right"
                @click="viewCourseDetails(course.id)"
              >
                <span class="icon">
                  <i class="far fa-eye"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr class="mb-0" />
      <p class="panel-tabs" v-if="userData.role === 'admin'">
        <a :class="{ 'is-active': showingAll }" @click="showAll()">Alle</a>
        <a :class="{ 'is-active': showingWithoutEditor }" @click="showWithoutEditor()">Ohne Bearbeiter</a>
      </p>
    </div>
  </nav>
</template>

<script>
import useFirebase, { getCourses, loadAllCourses, loadAllCoursesFilterWithoutEditor } from "../../store/firebase";
import { useRouter } from "vue-router";
import { ref } from 'vue';
export default {
  setup() {
    const courses = getCourses();
    const router = useRouter();
    const state = useFirebase();
    const showingAll = ref(true);
    const showingWithoutEditor = ref(false);
    const userData = state.userData.value;
    function editCourse(id) {
      router.push("/course-edit/"+id);
    }
    function viewCourseDetails(id) {
      router.push("/course-detail-view/"+id);
    }
    const showAll = () => {
      showingAll.value = true;
      showingWithoutEditor.value = false;
      loadAllCourses();
    }
    const showWithoutEditor = () => {
      showingAll.value = false;
      showingWithoutEditor.value = true;
      loadAllCoursesFilterWithoutEditor();
    }
    return {
      courses,
      editCourse,
      userData,
      viewCourseDetails,
      showingAll,
      showingWithoutEditor,
      showAll,
      showWithoutEditor
    };
  },
};
</script>

<style lang="scss" scoped>
.row:nth-child(odd) {
  background-color: whitesmoke;
}
.row:nth-child(even) {
  background-color: white;
}
.tag-button:hover {
  background-color: #00c4a7;
  border-color: transparent;
  color: #fff;
  cursor: pointer;
}
.box {
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}
.panel-tabs {
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}
</style>