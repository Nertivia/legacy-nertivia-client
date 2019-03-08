import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import {store} from './store/index';
import MainApp from '../src/views/App.vue'
import HomePage from '../src/views/HomePage.vue'
import GDriveCallback from '../src/views/GDriveCallback.vue';
import VueSocketio from 'vue-socket.io-extended';
import io from 'socket.io-client';
import config from './config'
import VueMq from 'vue-mq'

export const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/app',
      name: 'app',
      component: MainApp,
      beforeEnter (to, from, next) {
        if (!localStorage.getItem('hauthid')){
          return router.push({ path: '/' })
        }
        Vue.use(VueSocketio, io(config.socketIP, {
          transportOptions: {
            polling: {
              extraHeaders: {
                authorization: localStorage.getItem('hauthid')
              }
            }
          }
        }), {store});
        Vue.use(VueMq, {
          breakpoints: {
            mobile: 600,
            desktop: Infinity,
          }
        })
        next()
      }
    },
    {
      path: '/GDrive_callback',
      name: 'GDrive callback',
      component: GDriveCallback
    },
  ]
})