<template>
  <div class="columns is-centered is-vcentered">
    <div class="column is-12-desktop is-two-thirds-widescreen is-half-fullhd">
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
        <p class="panel-tabs">
          <a class="is-active">Alle</a>
          <a>Ohne Bearbeiter</a>
          <a>Deaktiviert</a>
        </p>
        <div v-for="course in courses" :key="course.id" class="panel-block">
          <div class="columns">
            <div class="column is-2">
              <span class="tag is-dark is-rounded">{{ course.id }}</span>
            </div>
            <div class="column is-8">
              <span class="ml-2">{{ course.courseName }}</span>
            </div>
            <div class="column is-2">
              <div class="buttons is-right">
                <span class="tag is-small is-primary">
                  Verwalten
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
import { useLoadCourses } from "../store/data";
export default {
  setup() {
    const courses = useLoadCourses()
    console.log(courses);
    return {
      courses
    };
  },
};
</script>

<style lang="scss" scoped>
.panel-block {
  display: block;
}
.panel-block:nth-child(odd) {
  background-color: whitesmoke;
}
.panel-block:nth-child(even) {
  background-color: white;
}
</style>