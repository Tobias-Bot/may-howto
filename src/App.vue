<template>
  <v-app>
    <v-app-bar
      app
      :height="this.toolbarHeight"
      :color="this.colorTheme"
      style="box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.3);"
    >
      <v-toolbar-title>
        <a href="https://vk.com/warmay" hidden ref="linkRef"></a
        ><span class="logoTitle" @click="goToMay">Мαú</span
        ><span class="appTitle">хауТу</span></v-toolbar-title
      >
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <v-dialog v-model="dialogSwitch" scrollable>
          <v-card color="#F0D5CE">
            <v-card-title>Привет!</v-card-title>
            <v-divider></v-divider>
            <v-card-text
              style="text-align: center; padding: 20px; font-weight: 500; font-size: 14px;"
            >
              Мы заметили, что ты не подписан на Май 😔
              <br />
              <br />
              Пожалуйста, поддержи нас подпиской на сообщество, ведь то, что
              делает Май, все это для тебя. Присоединяйся к нашей семье, чтобы
              учиться лучше разбираться в себе и других!
              <br />
              <br />
              ♥
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn
                color="blue darken-1"
                text
                @click="dialogSwitch = !dialogSwitch"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-btn color="blue darken-1" text @click="subscribeOnGroup">
                Подписаться
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-card>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card flat :color="this.colorTheme" :height="this.mainScreenHeight">
                <Main />
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat :color="this.colorTheme" :height="this.mainScreenHeight">
                <Favorites />
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-container>
    </v-main>

    <v-footer
      app
      :height="this.footerHeight"
      color="#FFEDE7"
      style="padding: 0px 16px"
    >
      <v-tabs
        v-model="tab"
        :background-color="this.colorTheme"
        slider-color="#FFF4ED"
        color="black"
        grow
        icons-and-text
        slider-size="4"
        style="border-radius: 3px; box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.3);"
      >
        <v-tab>
          <div class="tagTitle">Упражнения</div>
          <v-icon>mdi-format-list-bulleted-square</v-icon>
        </v-tab>
        <v-tab>
          <div class="tagTitle">Избранное</div>
          <v-icon>mdi-heart</v-icon>
        </v-tab>
      </v-tabs>
    </v-footer>
  </v-app>
</template>

<script>
import bridge from "@vkontakte/vk-bridge";
import qs from "querystring";

import Main from "./components/Main";
import Favorites from "./components/Favorites";

const group_id = 160404048;
const token =
  "f2f21eb0bf879c0e24b9abfeab21fc54b2b3c9a8df571eb5348479ed5ff10857ac0d87e982b79eb1b551e";

export default {
  name: "App",
  components: {
    Main,
    Favorites
  },
  data: () => ({
    colorTheme: "#F0D0C7",
    toolbarHeight: 55,
    footerHeight: 110,
    mainScreenHeight: 0,
    dialogSwitch: false,

    tab: null,
  }),
  created() {
    let savedCards = JSON.parse(localStorage.getItem("savedCards"));

    if (savedCards) this.$store.commit("setCards", savedCards);

    this.getInitialProps();
  },
  mounted() {
    const screenHeight = document.documentElement.scrollHeight;

    this.mainScreenHeight =
      screenHeight - this.toolbarHeight - this.footerHeight;
  },
  methods: {
    subscribeModal() {
      bridge.send("VKWebAppGetUserInfo");
    },
    subscribeOnGroup() {
      bridge.send("VKWebAppJoinGroup", { group_id }).then(() => {
        this.dialogSwitch = false;
      });
    },
    getInitialProps() {
      const str = window.location.search.slice(1);
      const objParams = qs.parse(str);
      let user_id = objParams.vk_user_id;
      let platform = objParams.vk_platform;

      if (platform === "mobile_iphone") {
        this.toolbarHeight = 70;
      }

      bridge
        .send("VKWebAppCallAPIMethod", {
          method: "groups.isMember",
          request_id: "info",
          params: {
            user_id,
            group_id,
            v: "5.131",
            access_token: token,
          },
        })
        .then((res) => {
          let isMember = res.response;
          if (!isMember) {
            setTimeout(() => {
              this.dialogSwitch = true;
            }, 12500);
          }
        });
    },
    goToMay() {
      //bridge.send("VKWebAppClose", { status: "success", payload: {} });
      this.$refs.linkRef.click();
    },
  },
};
</script>
