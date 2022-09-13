import Vue from 'vue'
import App from './App.vue'
import { PiniaVuePlugin } from 'pinia'
import createPinia from "@/controllers/piniaSingleton";
import vuetify from './plugins/vuetify'
import router from './router'
import VuetifyConfirm from 'vuetify-confirm';

Vue.config.productionTip = false;

Vue.use(PiniaVuePlugin);
Vue.use(VuetifyConfirm, {vuetify});
const pinia = createPinia();

new Vue({
  vuetify,
  router,
  pinia,
  render: h => h(App)
}).$mount('#app');
