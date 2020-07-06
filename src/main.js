import "./styles/hljs-shisutakia-theme.scss";

import Vue from "vue";
import { router } from "./router";
import Main from "../src/Main.vue";
import { store } from "./store/index";
import Axios from "axios";
import "./utils/clickOutside";
import vueHeadful from "vue-headful";
import Clipboard from "v-clipboard";
import {i18n} from "./i18n";

Vue.component("vue-headful", vueHeadful);
Vue.use(Clipboard);

Vue.config.productionTip = false;

const token = localStorage.getItem("hauthid");
Vue.prototype.$http = Axios;

if (token) {
  Vue.prototype.$http.defaults.headers.common["authorization"] = token;
}

export const bus = new Vue();

new Vue({
  store,
  router,
  i18n,
  render: h => h(Main)
}).$mount("#app");
