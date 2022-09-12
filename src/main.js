import Vue from 'vue'
import App from './App.vue'
import { PiniaVuePlugin } from 'pinia'
import createPinia from "@/controllers/piniaSingleton";
import vuetify from './plugins/vuetify'
import router from './router'

Vue.config.productionTip = false;

Vue.use(PiniaVuePlugin);
const pinia = createPinia();

new Vue({
  vuetify,
  router,
  pinia,
  render: h => h(App)
}).$mount('#app');
