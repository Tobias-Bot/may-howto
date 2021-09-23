<template>
  <div style="margin-bottom: 20px;">
    <v-card flat color="#FFEDE7" style="margin: 10px;">
      <v-img height="150" :src="task.data.cover"> </v-img>

      <v-card-title
        class="text"
        style="font-size: 18px; line-height: 1.5; opacity: 0.8;"
        >{{ task.data.title }}</v-card-title
      >

      <v-card-text v-if="task.data.ps">{{ task.data.ps }}</v-card-text>

      <v-row class="mr-1 pb-2 pt-1" align="center" justify="end">
        <v-card-actions>
          <v-btn
            class="cardTextBtn"
            text
            color="#A0847B"
            @click="sheet = !sheet"
          >
            Читать
          </v-btn>
          <div v-if="!this.isLike">
            <v-icon class="cardBtn" color="#A0847B" @click="likeCard">
              mdi-heart-outline
            </v-icon>
          </div>
          <div v-else>
            <v-icon class="cardBtn" color="#A0847B" @click="dislikeCard">
              mdi-heart
            </v-icon>
          </div>
        </v-card-actions>
      </v-row>
    </v-card>

    <v-bottom-sheet v-model="sheet">
      <v-sheet class="text-center" color="#FFEDE7">
        <v-btn class="mt-2" text color="#A0847B" @click="sheet = !sheet">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <div class="mt-2 mb-3" style="font-size: 18px; font-weight: 500;">
          {{ task.data.title }}
        </div>
        <div
          :style="
            `max-height: ${sheetHeight}px; overflow-y: auto; padding: 10px 10px 200px 10px;`
          "
        >
          <div
            v-if="task.data.ps"
            class="py-1 mb-4"
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
// import bridge from "@vkontakte/vk-bridge";

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

    console.log(this.task);
  },
  computed: {
    savedCards() {
      return this.$store.getters.getCards;
    },
    isLike() {
      let storeCards = this.savedCards;
      if (storeCards && ~storeCards.findIndex((c) => c === this.task.index)) {
        return true;
      }
      return false;
    },
  },
  methods: {
    likeCard() {
      let storeCards = this.savedCards;

      if (!storeCards) {
        storeCards = [];
      }

      storeCards.push(this.task.index);

      this.$store.commit("setCards", storeCards);
      this.isLiked = true;
    },
    dislikeCard() {
      let cards = this.savedCards;

      let tId = this.task.index;

      cards.splice(
        cards.findIndex((c) => tId === c),
        1
      );

      this.$store.commit("setCards", cards);
      this.isLiked = false;
    },
  },
};
</script>

<style scoped></style>
