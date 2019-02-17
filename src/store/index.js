import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/userModule';
import socketModule from './modules/socketIOModule';
import channelModule from './modules/channelModule';
import messageModule from './modules/messageModule';
import notificationsModule from './modules/notificationsModule';
import {router} from './../router'

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: { user, channelModule, messageModule, notificationsModule, socketModule },
  state: {

  },
  getters: {

  },
  mutations: {


  },
  actions: {

  }
})