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
        <div class="columns is-mobile is-centered mt-2 pr-4 pl-4">
          <div
            class="column is-2-desktop is-2-tablet is-2-widescreen is-2-fullhd is-one-quarter-mobile"
          >
            <span class="tag is-dark is-rounded">{{ course.id }}</span>
          </div>
          <div
            class="column is-8-desktop is-8-tablet is-8-widescreen is-8-fullhd is-half-mobile"
            style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"
          >
            <span class="ml-2">{{ course.courseName }}</span>
          </div>
          <div
            class="column is-2-desktop is-2-tablet is-2-widescreen is-2-fullhd is-one-quarter-mobile"
          >
            <div class="buttons is-right">
              <span
                class="tag is-small is-primary"
                @click="openCourseDetails()"
              >
                Verwalten
              </span>
            </div>
          </div>
        </div>
      </div>
      <hr class="mb-0">
      <p class="panel-tabs">
        <a class="is-active">Alle</a>
        <a>Ohne Bearbeiter</a>
        <a>Deaktiviert</a>
      </p>
    </div>
  </nav>
</template>

<script>
import { useLoadCourses } from "../store/data";
import { useRouter } from "vue-router";
export default {
  setup() {
    const courses = useLoadCourses();
    const router = useRouter();
    function openCourseDetails() {
      router.push("/course-detail-view");
    }
    console.log(courses);
    return {
      courses,
      openCourseDetails,
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
.tag:hover {
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