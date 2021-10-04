<template>
  <div>
    <v-card>
      <v-toolbar color="#FFEDE7" style="padding-top: 6px;">
        <v-row dense style="padding-bottom: 10px;">
          <v-col cols="10">
            <v-text-field
              hide-details
              label="Найти упражнение"
              placeholder="Чему хочешь научиться?"
              prepend-inner-icon="mdi-magnify"
              solo-inverted
              clearable
              dense
              :value="searchText"
              color="white"
              @input="(e) => searchTasks(e)"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-dialog v-model="dialogAddSwitch" scrollable>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  elevation="0"
                  color="#FFEDE7"
                  block
                  v-bind="attrs"
                  v-on="on"
                  ><v-icon color="#717171">mdi-plus</v-icon>
                </v-btn>
              </template>
              <v-card color="#F0D5CE">
                <v-card-title>Предложить упражнение</v-card-title>
                <v-divider></v-divider>
                <v-card-text
                  style="text-align: center; padding: 20px; font-weight: 500;"
                >
                  Ты можешь предложить свое упражнение/практику через
                  «предложить новость» или личные сообщения Май. Придумай
                  название и опиши свое упражнение. После одобрения
                  администрацией мы добавим его в общий каталог
                  <br />
                  <br />
                  <v-btn text>
                    <a
                      href="https://vk.com/warmay"
                      style="text-decoration: none; color: #6E5F5B;"
                      >Предложить</a
                    >
                  </v-btn>
                  <br />
                  <br />
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-btn
                    color="#6E5F5B"
                    text
                    @click="dialogAddSwitch = false"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
      </v-toolbar>

      <v-card
        v-scroll.self="onScroll"
        ref="ListPage"
        flat
        tile
        color="#F0D0C7"
        :style="
          `display: block; max-height: ${pageHeight}px; overflow-y: auto; padding: 1px 0px 15px 0px;`
        "
      >
        <div v-show="!searchedTasks.length" class="hintText">
          Ничего не нашлось 😴
        </div>

        <TaskCard
          v-for="(task, i) in searchedTasks.filter(
            (q, j) => j < tasksCountFilter
          )"
          :key="i"
          :task="{ index: i, data: task }"
        />

        <div
          v-show="loadTasks && tasksCountFilter <= searchedTasks.length"
          style="width: 100%; text-align: center; opacity: 0.7; font-size: 14px;"
        >
          <br />

          секундочку..

          <br />
          <br />
        </div>
      </v-card>
    </v-card>
  </div>
</template>

<script>
import tasks from "../data/tasks";

import TaskCard from "./TaskCard.vue";

const viewQuestCount = 6;

export default {
  name: "Main",
  props: {},
  components: {
    TaskCard,
  },
  data() {
    return {
      pageHeight: 0,
      searchText: "",
      dialogAddSwitch: false,
      loadTasks: true,
      searchedTasks: tasks,

      tasksCountFilter: viewQuestCount,
    };
  },
  mounted() {
    this.pageHeight = document.documentElement.scrollHeight - 110 - 100;
  },
  updated() {
    this.loadTasks = true;
  },
  methods: {
    searchTasks(text) {
      this.searchText = text;
      this.tasksCountFilter = viewQuestCount;

      if (text && text !== " ") {
        new Promise((resolve) =>
          resolve(this.searchedTasks.filter((q) => q.title.includes(text)))
        ).then((res) => (this.searchedTasks = res));
      } else {
        this.searchedTasks = tasks;
      }
    },
    onScroll(e) {
      let viewHeight = this.$refs.ListPage.$refs.link.scrollHeight;

      if (
        (e.target.scrollTop * 100) / viewHeight >= 45 &&
        this.tasksCountFilter <= tasks.length &&
        this.loadTasks
      ) {
        this.loadTasks = false;
        this.tasksCountFilter += this.tasksCountFilter;
      }
    },
  },
};
</script>

<style scoped></style>
