<template>
  <div style="margin-bottom: 20px;">
    <v-card flat color="#FFF4ED" style="margin: 10px;">
      <v-img height="250" :src="task.data.cover"></v-img>

      <v-card-title class="text" style="font-size: 16px; line-height: 1.5;">{{
        task.data.title
      }}</v-card-title>

      <v-card-text v-if="task.data.ps">{{ task.data.ps }}</v-card-text>

      <v-row class="mr-1 pb-2 pt-1" align="center" justify="end">
        <v-card-actions>
          <v-btn text color="#FF8A47" @click="sheet = !sheet">
            Подробнее
          </v-btn>
        </v-card-actions>
      </v-row>
    </v-card>

    <v-bottom-sheet v-model="sheet">
      <v-sheet class="text-center" color="#FFF4ED">
        <v-btn class="mt-2" text color="blue" @click="sheet = !sheet">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <div
          :style="
            `max-height: ${sheetHeight}px; overflow-y: auto; padding: 0px 10px 20px 10px;`
          "
        >
          <div class="mt-2" style="font-size: 18px; font-weight: 500;">
            {{ task.data.title }}
          </div>
          <div
            v-if="task.data.ps"
            class="py-1"
            style="font-size: 14px; font-weight: 500; opacity: 0.6;"
          >
            {{ task.data.ps }}
          </div>
          <div
            class="py-1"
            style="text-align: left; opacity: 0.9; font-size: 14px; font-weight: 500;"
            v-html="task.data.description"
          ></div>
        </div>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
import bridge from "@vkontakte/vk-bridge";

export default {
  name: "TaskCard",
  props: ["task"],
  data() {
    return {
      sheet: false,
      sheetHeight: 0,
    };
  },
  mounted() {
    this.sheetHeight = document.documentElement.scrollHeight;
  },
  methods: {},
};
</script>

<style scoped></style>
