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
            @input="(e) => searchFavorites(e)"
          ></v-text-field>
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

        <div v-show="!savedCards.length" class="hintText">
          Нет сохраненных упражнений
        </div>

        <TaskCard
          v-for="(task, i) in searchedTasks.filter(
            (q, j) => j < tasksCountFilter
          )"
          :key="i"
          :task="{ index: task, data: tasks[task] }"
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
import TaskCard from "./TaskCard.vue";

import tasks from "../data/tasks";

const viewQuestCount = 6;

export default {
  name: "Favorites",
  props: {},
  components: {
    TaskCard,
  },
  data() {
    return {
      pageHeight: 0,
      searchText: "",
      loadTasks: true,
      searchedTasks: [],
      tasks,
      tasksCountFilter: viewQuestCount,
    };
  },
  mounted() {
    this.pageHeight = document.documentElement.scrollHeight - 110 - 100;
    this.searchedTasks = this.savedCards;
  },
  updated() {
    this.loadTasks = true;
  },
  computed: {
    savedCards() {
      return this.$store.getters.getCards;
    },
  },
  methods: {
    searchFavorites(text) {
      this.searchText = text;
      this.tasksCountFilter = viewQuestCount;

      if (text && text !== " ") {
        let query = [];

        for (let i = 0; i < this.savedCards.length; i++) {
          let index = tasks.findIndex((q, id) => id === this.savedCards[i]);
          if (~index && tasks[index].title.includes(this.searchText)) {
            query.push(index);
          }

          this.searchedTasks = query;
        }
      } else {
        this.searchedTasks = this.savedCards;
      }
    },
    onScroll(e) {
      let viewHeight = this.$refs.ListPage.$refs.link.scrollHeight;
      // console.log((e.target.scrollTop * 100) / viewHeight);

      if (
        (e.target.scrollTop * 100) / viewHeight >= 35 &&
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
