import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import bridge from "@vkontakte/vk-bridge";

import './App.css';

bridge.send("VKWebAppInit", {});

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
