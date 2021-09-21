<template>
  <div>
    <v-card>
      <v-toolbar color="#FFF4ED" style="padding-top: 5px;">
        <v-row dense style="padding-bottom: 10px;">
          <v-text-field
            hide-details
            label="Поиск по избранному"
            placeholder="Я найду твое любимое!"
            prepend-inner-icon="mdi-magnify"
            solo-inverted
            clearable
            dense
            :value="searchText"
            color="white"
            @input="(e) => searchQuestions(e)"
          ></v-text-field>
        </v-row>
      </v-toolbar>

      <v-card
        v-scroll.self="onScroll"
        ref="ListPage"
        flat
        tile
        color="#FFC6A3"
        :style="
          `display: block; max-height: ${pageHeight}px; overflow-y: auto; padding: 1px 0px 15px 0px;`
        "
      >
        <div v-show="!searchedTasks.length" class="hintText">
          Ничего не нашлось 😴
        </div>

        <TaskCard
          v-for="(task, i) in searchedTasks.filter(
            (q, j) => j < questCountFilter
          )"
          :key="i"
          :task="{ index: i, data: task }"
        />

        <div
          v-show="loadQuests && questCountFilter <= searchedTasks.length"
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
      colorTheme: "#F0EAD6",
      pageHeight: 0,
      searchText: "",
      dialogFilterSwitch: false,
      dialogAddSwitch: false,
      loadQuests: true,
      searchedTasks: tasks,

      questCountFilter: viewQuestCount,

      filterProps: {
        lvl: 0,
        depth: 0,
        closeness: 0,
        emotions: 0,
      },

      propsAreChanged: false,
    };
  },
  mounted() {
    this.pageHeight = document.documentElement.scrollHeight - 110 - 159;
  },
  updated() {
    this.loadQuests = true;
  },
  methods: {
    searchQuestions(text) {
      this.searchText = text;
      this.questCountFilter = viewQuestCount;

      if (text && text !== " ") {
        new Promise((resolve) =>
          resolve(this.quests.filter((q) => q.text.includes(text)))
        ).then((res) => (this.quests = res));
      } else {
        this.quests = tasks;
        this.topicQuestions(this.currentTab);
      }
    },
    onScroll(e) {
      let viewHeight = this.$refs.ListPage[0].$refs.link.scrollHeight;
      // console.log(e.target.scrollTop * 100 / viewHeight);
      if (
        (e.target.scrollTop * 100) / viewHeight >= 45 &&
        this.questCountFilter <= tasks.length &&
        this.loadQuests
      ) {
        this.loadQuests = false;
        this.questCountFilter += this.questCountFilter;
        this.prevQuestsFilter = e.target.scrollTop;
        // console.log("new cards are loaded");
      }
    },
  },
};
</script>

<style scoped></style>
