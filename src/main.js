import Vue from 'vue'
import {router} from './router'
import Main from '../src/Main.vue'
import {store} from './store/index';
import Axios from 'axios';
import './utils/clickOutside';
import vueHeadful from 'vue-headful';
Vue.component('vue-headful', vueHeadful);

Vue.config.productionTip = false

const token = localStorage.getItem('hauthid');
Vue.prototype.$http = Axios;

if (token) {
  Vue.prototype.$http.defaults.headers.common['authorization'] = token;
}

export const bus = new Vue();


new Vue({
  store,
  router,
  render: h => h(Main)
}).$mount('#app')
