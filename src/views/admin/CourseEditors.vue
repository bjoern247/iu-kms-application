<template>
  <nav class="panel is-info">
    <p class="panel-heading">{{ course.courseName }} zugewiesen:</p>
    <div class="panel-block">
      <p class="control has-icons-left">
        <input class="input" type="text" placeholder="Search" />
        <span class="icon is-left">
          <i class="fas fa-search" aria-hidden="true"></i>
        </span>
      </p>
    </div>
    <div class="box p-0">
      <div
        class="columns is-mobile is-centered mt-2 mb-0 mr-0 ml-0"
        style="background-color: whitesmoke; border-bottom: 1px solid lightgrey"
      >
        <div
          class="column is-3-desktop is-3-tablet is-3-widescreen is-4-fullhd is-2-mobile"
        >
          E-Mail
        </div>
        <div
          class="column is-4-desktop is-4-tablet is-4-widescreen is-3-fullhd is-5-mobile"
        >
          Name
        </div>
        <div
          class="column is-2-desktop is-2-tablet is-2-widescreen is-3-fullhd is-2-mobile"
        >
          Nutzerrolle
        </div>
        <div
          class="column is-2-desktop is-2-tablet is-2-widescreen is-2-fullhd is-3-mobile has-text-right"
        ></div>
      </div>

      <div v-for="user in assignedEditors" :key="user.uid" class="row">
        <div
          class="columns is-mobile is-centered is-vcentered mb-0 mt-0 mr-0 ml-0"
        >
          <div
            style="
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            "
            class="column is-3-desktop is-3-tablet is-3-widescreen is-4-fullhd is-2-mobile"
          >
            <span>{{ user.email }}</span>
          </div>
          <div
            class="column is-4-desktop is-4-tablet is-4-widescreen is-3-fullhd is-5-mobile"
            style="
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            "
          >
            <span>{{ user.displayName }} </span>
          </div>
          <div
            class="column is-2-desktop is-2-tablet is-2-widescreen is-3-fullhd is-3-mobile"
          >
            <span v-if="user.role === 'student'" class="tag is-medium is-info">
              Student
            </span>
            <span
              v-else-if="user.role === 'editor'"
              class="tag is-medium is-warning"
            >
              Bearbeiter
            </span>
            <span
              v-else-if="user.role === 'admin'"
              class="tag is-medium is-danger"
            >
              Admin
            </span>
          </div>
          <div
            class="column is-2-desktop is-2-tablet is-2-widescreen is-2-fullhd is-2-mobile"
          >
            <div class="buttons is-right">
              <button
                class="button is-danger is-pulled-right"
                @click="unassignEditor(user.uid, course.id, course.courseId)"
              >
                <span class="icon">
                  <i class="fas fa-trash"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr class="mb-0" />
    </div>
  </nav>
  <nav class="panel is-primary">
    <p class="panel-heading">Mögliche Bearbeiter:</p>
    <div class="panel-block">
      <p class="control has-icons-left">
        <input class="input" type="text" placeholder="Search" />
        <span class="icon is-left">
          <i class="fas fa-search" aria-hidden="true"></i>
        </span>
      </p>
    </div>
    <div class="box p-0">
      <div
        class="columns is-mobile is-centered mt-2 mb-0 mr-0 ml-0"
        style="background-color: whitesmoke; border-bottom: 1px solid lightgrey"
      >
        <div
          class="column is-3-desktop is-3-tablet is-3-widescreen is-4-fullhd is-2-mobile"
        >
          E-Mail
        </div>
        <div
          class="column is-4-desktop is-4-tablet is-4-widescreen is-3-fullhd is-5-mobile"
        >
          Name
        </div>
        <div
          class="column is-2-desktop is-2-tablet is-2-widescreen is-3-fullhd is-2-mobile"
        >
          Nutzerrolle
        </div>
        <div
          class="column is-2-desktop is-2-tablet is-2-widescreen is-2-fullhd is-3-mobile has-text-right"
        ></div>
      </div>

      <div v-for="editor in unassignedEditors" :key="editor.uid" class="row">
        <div
          class="columns is-mobile is-centered is-vcentered mb-0 mt-0 mr-0 ml-0"
        >
          <div
            style="
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            "
            class="column is-3-desktop is-3-tablet is-3-widescreen is-4-fullhd is-2-mobile"
          >
            <span>{{ editor.email }}</span>
          </div>
          <div
            class="column is-4-desktop is-4-tablet is-4-widescreen is-3-fullhd is-5-mobile"
            style="
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            "
          >
            <span>{{ editor.displayName }} </span>
          </div>
          <div
            class="column is-2-desktop is-2-tablet is-2-widescreen is-3-fullhd is-3-mobile"
          >
            <span
              v-if="editor.role === 'student'"
              class="tag is-medium is-info"
            >
              Student
            </span>
            <span
              v-else-if="editor.role === 'editor'"
              class="tag is-medium is-warning"
            >
              Bearbeiter
            </span>
            <span
              v-else-if="editor.role === 'admin'"
              class="tag is-medium is-danger"
            >
              Admin
            </span>
          </div>
          <div
            class="column is-2-desktop is-2-tablet is-2-widescreen is-2-fullhd is-2-mobile"
          >
            <div class="buttons is-right">
              <button class="button is-dark is-pulled-right" @click="assignEditor(editor.uid, course.id, course.courseId)">
                <span class="icon">
                  <i class="fas fa-arrow-up"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr class="mb-0" />
    </div>
  </nav>
</template>

<script>
import {
  getUsers,
  getCourse,
  getUnassignedEditors,
  getAssignedEditors,
  assignEditor,
  unassignEditor
} from "../../store/firebase";
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const users = getUsers();
    const unassignedEditors = getUnassignedEditors();
    const course = getCourse(router.currentRoute.value.params.id);
    const assignedEditors = getAssignedEditors();
    console.log(course.courseName);
    return {
      users,
      course,
      unassignedEditors,
      assignedEditors,
      assignEditor,
      unassignEditor
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