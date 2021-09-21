<template>
  <div>
    <v-card>
      <v-toolbar color="#FFF4ED" style="padding-top: 5px;">
        <v-row dense style="padding-bottom: 10px;">
          <v-col cols="8">
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
              @input="(e) => searchQuestions(e)"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-dialog v-model="dialogFilterSwitch" scrollable persistent>
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="#FFF4ED" block v-bind="attrs" v-on="on"
                  ><v-icon v-show="!propsAreChanged" color="#717171"
                    >mdi-filter-variant</v-icon
                  >
                  <v-icon v-show="propsAreChanged" color="black"
                    >mdi-filter-variant-minus</v-icon
                  >
                </v-btn>
              </template>
              <v-card color="#FFF4ED">
                <v-card-title>Фильтр</v-card-title>
                <v-divider></v-divider>
                <v-card-text
                  style="text-align: center; padding: 20px; font-weight: 500;"
                >
                  <!-- <div
                    v-for="prop in questProps"
                    :key="prop.name"
                    style="text-align: left"
                  >
                    <b>{{ prop.name }} ({{ filterProps[prop.propName] }})</b>
                    <v-slider
                      dense
                      :hint="prop.hint"
                      max="100"
                      min="0"
                      step="5"
                      :value="filterProps[prop.propName]"
                      persistent-hint
                      @change="(value) => setFilterProps(value, prop.propName)"
                    ></v-slider>
                    <br />
                  </div> -->
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="dialogFilterSwitch = false"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <!-- <v-btn
                    v-show="propsAreChanged"
                    color="blue darken-1"
                    text
                    @click="resetFilterProps"
                  >
                    сбросить
                  </v-btn> -->
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
          <v-col cols="2">
            <v-dialog v-model="dialogAddSwitch" scrollable>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  elevation="0"
                  color="#FFF4ED"
                  block
                  v-bind="attrs"
                  v-on="on"
                  ><v-icon color="#717171">mdi-plus</v-icon>
                </v-btn>
              </template>
              <v-card color="#FFF4ED">
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
                  <v-btn color="#59564F" text>
                    <a
                      href="https://vk.com/warmay"
                      style="text-decoration: none;"
                      >Предложить</a
                    >
                  </v-btn>
                  <br />
                  <br />
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-btn
                    color="blue darken-1"
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
        color="#FFC6A3"
        :style="
          `display: block; max-height: ${pageHeight}px; overflow-y: auto; padding: 1px 0px 15px 0px;`
        "
      >
        <div v-show="!searchedTasks.length" class="hintText">
          Ничего не нашлось 😴
        </div>

        <TaskCard
          v-for="(task, i) in searchedTasks.filter((q, j) => j < questCountFilter)"
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
